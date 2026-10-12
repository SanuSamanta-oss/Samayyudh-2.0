// ============================================================
// SamayYudh 2.0 — SOKHA Streaming Chat API Endpoint
// Route: POST /api/sokha/chat
// Supports real-time SSE streaming, Google Search Grounding,
// server-side privacy redaction, and abuse protection.
// ============================================================

import { NextRequest } from 'next/server';
import {
  getGeminiClient,
  getSamayyudhSystemInstruction,
  SAMAYYUDH_SYSTEM_INSTRUCTION,
  formatConversationContents,
  extractGroundingSources,
  type ChatMessageInput,
  type GroundingSource,
} from '@/lib/sokha/gemini';
import { sanitizeStudentMessage } from '@/lib/sokha/privacy';
import { checkRateLimit } from '@/lib/sokha/rate-limiter';

export const maxDuration = 60; // Up to 60s for streaming completions

interface RequestBody {
  message: string;
  userName?: string;
  history?: ChatMessageInput[];
  enableWebSearch?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Identify client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 2. Check rate limit
    const rateStatus = checkRateLimit(ip);
    if (!rateStatus.allowed) {
      const msg = rateStatus.isDailyLimitExceeded
        ? 'Daily free quota for SOKHA reached. Please return tomorrow or contact administrator.'
        : `Rate limit reached. Please wait ${rateStatus.resetSeconds}s before sending another question.`;

      return Response.json(
        {
          error: 'Rate limit exceeded',
          message: msg,
          retryAfter: rateStatus.resetSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateStatus.resetSeconds) },
        }
      );
    }

    // 3. Verify Gemini API setup
    const gemini = getGeminiClient();
    if (!gemini) {
      const isDev = process.env.NODE_ENV !== 'production';
      return Response.json(
        {
          error: 'AI service not configured',
          message: isDev
            ? 'GEMINI_API_KEY is not configured in .env.local. Obtain a free key at https://aistudio.google.com/apikey.'
            : 'SOKHA study companion is temporarily unavailable. Please check back shortly.',
        },
        { status: 503 }
      );
    }

    // 4. Parse & Validate request body
    const body = (await req.json()) as RequestBody;
    const rawMessage = body?.message;

    if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    if (rawMessage.length > 4000) {
      return Response.json(
        { error: 'Message is too long. Please keep questions under 4,000 characters.' },
        { status: 400 }
      );
    }

    // 5. Server-side privacy check & PII redaction
    const privacyCheck = sanitizeStudentMessage(rawMessage);
    if (!privacyCheck.isSafe) {
      const refusalMsg =
        privacyCheck.rejectionReason ||
        'I am SOKHA, your academic study companion for সময়যুদ্ধ 2.0. No NSFW or inappropriate conversations are entertained. Please keep all questions focused on your studies, exams, and syllabus preparation.';

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text: refusalMsg })}\n\n`)
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'metadata',
                sources: [],
                redactedTypes: privacyCheck.redactedTypes,
              })}\n\n`
            )
          );
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const cleanMessage = privacyCheck.sanitizedText;
    const history = Array.isArray(body.history) ? body.history : [];
    const enableWebSearch = body.enableWebSearch !== false; // Default enabled
    const rawUserName = typeof body?.userName === 'string' ? body.userName.trim() : '';
    const userName = rawUserName ? rawUserName.slice(0, 50) : 'Student';

    // 6. Format contents for Gemini
    const contents = formatConversationContents(history, cleanMessage);

    // 7. Configure Gemini tools: enable Google Search grounding if requested
    const tools: any[] = [];
    if (enableWebSearch) {
      tools.push({ googleSearch: {} });
    }

    // 8. Stream response via Server-Sent Events (SSE)
    const encoder = new TextEncoder();
    const systemInstruction = getSamayyudhSystemInstruction(userName);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = await gemini.ai.models.generateContentStream({
            model: gemini.model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.6,
              maxOutputTokens: 2048,
              tools: tools.length > 0 ? tools : undefined,
            },
          });

          let collectedSources: GroundingSource[] = [];

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`)
              );
            }

            // Extract grounding metadata if present
            const candidate = chunk.candidates?.[0];
            if (candidate) {
              const sources = extractGroundingSources(candidate);
              if (sources.length > 0) {
                collectedSources = sources;
              }
            }
          }

          // Send final metadata packet with citations and any redactions made
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'metadata',
                sources: collectedSources,
                redactedTypes: privacyCheck.redactedTypes,
              })}\n\n`
            )
          );

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (streamError: any) {
          console.error('[SOKHA Stream Error]:', streamError?.message || streamError);
          const isQuota =
            streamError?.status === 429 ||
            streamError?.message?.includes('RESOURCE_EXHAUSTED') ||
            streamError?.message?.includes('quota');

          const userFriendlyError = isQuota
            ? 'The free AI service quota is currently exhausted. Please try again in a few moments.'
            : 'SOKHA encountered a connection issue while generating your response. Please try again.';

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                message: userFriendlyError,
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[SOKHA Route Error]:', error);
    return Response.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong while connecting to SOKHA. Please try again.',
      },
      { status: 500 }
    );
  }
}
