import type { Metadata } from 'next';
import { TeacherVerificationCenter } from '@/components/teacher/TeacherVerificationCenter';

export const metadata: Metadata = {
  title: 'Teacher Verification Center | SamayYudh 2.0',
  description: 'Authenticate your teaching credentials and institution affiliations.',
};

export default function TeacherVerifyPage() {
  return <TeacherVerificationCenter />;
}

