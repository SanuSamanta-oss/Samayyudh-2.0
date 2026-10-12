// ============================================================
// SamayYudh 2.0 — SOKHA Privacy & Redaction Engine
// Strictly enforces server-side privacy, PII redaction, and
// prompt injection defenses before any external AI or search call.
// ============================================================

export interface PrivacyCheckResult {
  isSafe: boolean;
  sanitizedText: string;
  redactedTypes: string[];
  rejectionReason?: string;
}

// Common sensitive data regex patterns
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
// Matches international and Indian phone number formats (10-14 digits)
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}\b/g;
// Credit/Debit card numbers (13 to 19 digits with optional spaces or dashes)
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,19}\b/g;
// Common API key patterns (Google AI, OpenAI, Supabase, JWTs, Bearer tokens)
const API_KEY_REGEX = /\b(?:AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{20,}|eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}|bearer\s+[a-zA-Z0-9._~+/-]+=*|AQ\.[0-9A-Za-z-_]{30,})\b/gi;
// Indian UPI IDs (e.g., user@okhdfcbank, student@paytm)
const UPI_REGEX = /\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g;
// One-time password (OTP) requests or claims (e.g., "my OTP is 849201")
const OTP_REGEX = /\b(?:otp|one[- ]time[- ]password|verification[- ]code)\s*(?:is|:|=)?\s*([0-9]{4,8})\b/gi;
// Password assignment patterns (e.g., "my password is secret123")
const PASSWORD_REGEX = /\b(?:password|passwd|pwd)\s*(?:is|:|=)\s*([^\s]{4,})/gi;

// Prompt injection or sensitive extraction attempts
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions/i,
  /reveal\s+(?:your\s+)?(?:system\s+prompt|internal\s+instructions|system\s+instructions)/i,
  /output\s+(?:the\s+)?(?:api\s+key|environment\s+variables|database\s+password|service[- ]role)/i,
  /print\s+(?:the\s+)?(?:process\.env|credentials|secret)/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /bypass\s+(?:all\s+)?(?:safety|privacy)\s+filters/i,
];

// Strict NSFW, sexually explicit, erotic, adult, or inappropriate content patterns
const NSFW_PATTERNS = [
  /\b(?:porn|porno|pornography|nsfw|xxx|erotic|erotica|hentai)\b/i,
  /\b(?:nude|nudes|nudity|naked|striptease)\b/i,
  /\b(?:sex|sexy|sexual|sexually|intercourse|orgasm|climax)\b/i,
  /\b(?:penis|vagina|boobs|breasts|dick|cock|pussy|tits|dildo)\b/i,
  /\b(?:blowjob|handjob|cum|ejaculat(?:e|ion)|masturbat(?:e|ion))\b/i,
  /\b(?:horny|fetish|bdsm|kinky|bondage|erotic\s+roleplay)\b/i,
];

/**
 * Validates a potential credit card number using the Luhn algorithm.
 */
function isLuhnValid(digitsStr: string): boolean {
  const digits = digitsStr.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Analyzes and sanitizes student messages before external processing.
 * Redacts emails, phone numbers, card numbers, secrets, and passwords.
 * Strictly blocks prompt injections and NSFW content.
 */
export function sanitizeStudentMessage(rawInput: string): PrivacyCheckResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isSafe: true, sanitizedText: '', redactedTypes: [] };
  }

  const trimmed = rawInput.trim();
  const redactedTypes: string[] = [];

  // 1. Check for dangerous prompt injection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        sanitizedText: '',
        redactedTypes: ['PROMPT_INJECTION'],
        rejectionReason:
          "SOKHA focuses on academic learning and exam preparation. I cannot process requests attempting to reveal or bypass system instructions.",
      };
    }
  }

  // 2. Strict NSFW & Inappropriate Content Guardrail
  for (const pattern of NSFW_PATTERNS) {
    if (pattern.test(trimmed)) {
      // Exemption for standard biology syllabus questions (e.g. "sexual reproduction in flowering plants", "NCERT biology")
      const isAcademicBio = /\b(?:asexual\s+reproduction|sexual\s+reproduction|reproduction\s+in\s+(?:organisms|flowering\s+plants|animals)|ncert|biology|neet|gametes|fertilization)\b/i.test(trimmed);
      const isHardNsfw = /\b(?:porn|porno|pornography|xxx|hentai|nude|nudes|blowjob|handjob|dildo|horny|fetish|kinky|erotic\s+roleplay)\b/i.test(trimmed);

      if (isHardNsfw || !isAcademicBio) {
        return {
          isSafe: false,
          sanitizedText: '',
          redactedTypes: ['NSFW_CONTENT'],
          rejectionReason:
            "I am SOKHA, your academic study companion for সময়যুদ্ধ 2.0. No NSFW or inappropriate conversations are entertained. Please keep all questions focused on your studies, exams, and syllabus preparation.",
        };
      }
    }
  }

  let sanitized = trimmed;

  // 1. Redact API keys and authorization tokens
  if (API_KEY_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(API_KEY_REGEX, '[REDACTED_API_KEY]');
    redactedTypes.push('API_KEY');
  }

  // 2. Redact Passwords
  if (PASSWORD_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(PASSWORD_REGEX, (match, p1) => match.replace(p1, '[REDACTED_PASSWORD]'));
    redactedTypes.push('PASSWORD');
  }

  // 3. Redact OTPs
  if (OTP_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(OTP_REGEX, (match, p1) => match.replace(p1, '[REDACTED_OTP]'));
    redactedTypes.push('OTP');
  }

  // 4. Redact Credit / Debit Card numbers (verified with Luhn or standard 16 digit lengths)
  sanitized = sanitized.replace(CREDIT_CARD_REGEX, (match) => {
    const raw = match.replace(/[\s-]/g, '');
    if ((raw.length === 15 || raw.length === 16) && isLuhnValid(raw)) {
      redactedTypes.push('PAYMENT_CARD');
      return '[REDACTED_CARD_NUMBER]';
    }
    return match;
  });

  // 5. Redact Email addresses
  if (EMAIL_REGEX.test(sanitized)) {
    sanitized = sanitized.replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
    redactedTypes.push('EMAIL');
  }

  // 6. Redact Phone numbers (10+ digits)
  sanitized = sanitized.replace(PHONE_REGEX, (match) => {
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
      redactedTypes.push('PHONE_NUMBER');
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  return {
    isSafe: true,
    sanitizedText: sanitized,
    redactedTypes: Array.from(new Set(redactedTypes)),
  };
}

/**
 * Strips any sensitive fields from system logs.
 */
export function sanitizeLogData(data: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...data };
  const sensitiveKeys = ['email', 'phone', 'password', 'token', 'key', 'secret', 'authorization', 'cookie'];
  for (const k of Object.keys(copy)) {
    if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
      copy[k] = '[REDACTED]';
    }
  }
  return copy;
}
