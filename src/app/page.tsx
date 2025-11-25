import CTA from '@/components/CTA';
import ExperienceGames from '@/components/ExperienceGames';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import IndependentLearning from '@/components/IndependentLearning';
import ProgressReports from '@/components/ProgressReports';
import SomethingNew from '@/components/SomethingNew';
import Stats from '@/components/Stats';
import UnlimitedFun from '@/components/UnlimitedFun';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <UnlimitedFun />
      <ExperienceGames />
      <SomethingNew />
      <IndependentLearning />
      <ProgressReports />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
