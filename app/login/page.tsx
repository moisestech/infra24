import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginPageContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
