import DetailedFooter from '@/components/DetailedFooter';
import LoginHeader from '@/components/LoginHeader';
import LoginHero from '@/components/LoginHero';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <LoginHeader />
      <LoginHero />
      <DetailedFooter />
    </main>
  );
}
