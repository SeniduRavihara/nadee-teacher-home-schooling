import DetailedFooter from '@/components/DetailedFooter';
import SignupHeader from '@/components/SignupHeader';
import SignupHero from '@/components/SignupHero';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-white">
      <SignupHeader />
      <SignupHero />
      <DetailedFooter />
    </main>
  );
}
