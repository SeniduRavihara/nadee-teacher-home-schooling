import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a4a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <div className="mb-4">
              <Image src="/logo.jpg" alt="SplashLearn" width={150} height={40} className="h-8 w-auto brightness-0 invert" />
            </div>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">News</Link></li>
              <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">Sitemap</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold mb-4">Parents</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="#" className="hover:text-white">Math Games</Link></li>
              <li><Link href="#" className="hover:text-white">Reading Games</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold mb-4">Teachers</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link href="#" className="hover:text-white">School Access</Link></li>
              <li><Link href="#" className="hover:text-white">Curriculum</Link></li>
            </ul>
          </div>
          
           {/* Column 5 - Socials */}
           <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <h4 className="font-bold mb-4">Follow Us</h4>
             <div className="flex gap-4">
               <Link href="#" className="text-blue-200 hover:text-white"><Facebook size={20} /></Link>
               <Link href="#" className="text-blue-200 hover:text-white"><Twitter size={20} /></Link>
               <Link href="#" className="text-blue-200 hover:text-white"><Instagram size={20} /></Link>
               <Link href="#" className="text-blue-200 hover:text-white"><Linkedin size={20} /></Link>
               <Link href="#" className="text-blue-200 hover:text-white"><Youtube size={20} /></Link>
             </div>
           </div>
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} SplashLearn. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-blue-300">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Use</Link>
          </div>
          
          {/* KidSafe Seal Placeholder */}
          <div className="flex items-center gap-2">
             <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-900">kidSAFE+</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
