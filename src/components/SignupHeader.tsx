import Image from 'next/image';
import Link from 'next/link';

export default function SignupHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="SplashLearn" width={150} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
             {/* Mascot Placeholder */}
             <div className="hidden sm:block w-8 h-8 bg-pink-300 rounded-full"></div>
             
             <button className="hidden sm:block bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors">
                Sign in with Class Code
             </button>
             
             <Link href="/login" className="border-2 border-blue-200 text-blue-900 px-6 py-2 rounded-full font-bold text-sm hover:border-blue-600 transition-colors">
                Log in
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
