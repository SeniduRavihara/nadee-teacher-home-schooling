import Image from 'next/image';
import Link from 'next/link';

export default function LoginHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="NadeeTeacher" width={150} height={40} className="h-10 w-auto" />
              <span className="text-xl font-bold text-blue-900">NadeeTeacher</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
             <Link href="/signup" className="border-2 border-blue-200 text-blue-900 px-6 py-2 rounded-full font-bold text-sm hover:border-blue-600 transition-colors">
                Sign Up
             </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
