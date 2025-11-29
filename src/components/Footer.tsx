import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a4a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="mb-4 flex justify-center md:justify-start">
              <Link href="/">
                <Image src="/logo.jpg" alt="Nadee Teacher" width={150} height={40} className="h-8 w-auto" />
              </Link>
            </div>
            <p className="text-blue-200 text-sm max-w-xs">
              Empowering students with interactive quizzes and expert-led classes.
            </p>
          </div>

          {/* Socials */}
          <div className="flex gap-6">
             <Link href="#" className="text-blue-200 hover:text-white transition-colors"><Facebook size={24} /></Link>
             <Link href="#" className="text-blue-200 hover:text-white transition-colors"><Twitter size={24} /></Link>
             <Link href="#" className="text-blue-200 hover:text-white transition-colors"><Instagram size={24} /></Link>
             <Link href="#" className="text-blue-200 hover:text-white transition-colors"><Youtube size={24} /></Link>
          </div>
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} Nadee Teacher. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-blue-300">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Use</Link>
            <Link href="#" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
