import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">SplashLearn</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Parents <ChevronDown size={16} />
              </button>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
                Educators <ChevronDown size={16} />
              </button>
            </div>
            <Link href="#" className="text-gray-600 hover:text-blue-600 font-medium">
              Our Story
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700">
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
