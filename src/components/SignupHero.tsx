import { FileText, Smile, Star } from 'lucide-react';
import SignupForm from './SignupForm';

export default function SignupHero() {
  return (
    <section className="pt-24 pb-16 bg-white relative overflow-hidden">
      {/* Background Shapes - Simplified */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-50 rounded-r-[100px] -z-10 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a4a]">
            Create your free SplashLearn parent account
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Value Props */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="relative w-[400px] h-[400px] mb-8">
               {/* Abstract Shape Mask Placeholder */}
               <div className="absolute inset-0 bg-gray-200 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border-4 border-white shadow-xl">
                  {/* Placeholder for Family Image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-400 font-medium">Family Learning Image</span>
                  </div>
               </div>
               
               {/* Decorative Elements */}
               <div className="absolute top-0 left-10 w-8 h-8 bg-orange-400 rounded-full"></div>
               <div className="absolute top-10 right-0 w-16 h-16 bg-[#0a0a4a] rounded-full"></div>
               <div className="absolute bottom-10 left-0 w-12 h-12 bg-purple-500 rounded-full"></div>
            </div>

            <h2 className="text-xl font-bold text-[#0a0a4a] mb-8 text-center">
              Kids see fun. You see real learning outcomes.
            </h2>

            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Smile size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Personalised<br />Learning
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Star size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Fun<br />Rewards
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={18} />
                </div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  Actionable<br />Reports
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-6 rounded-2xl">
            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  );
}
