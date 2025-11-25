import LoginForm from './LoginForm';

export default function LoginHero() {
  return (
    <section className="pt-24 pb-16 bg-white relative overflow-hidden">
      {/* Background Shapes - Simplified */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-50 rounded-r-[100px] -z-10 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a4a]">
            Welcome back to SplashLearn
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Value Props */}
          <div className="hidden lg:flex flex-col items-center">
            <div className="relative w-[400px] h-[400px] mb-8">
               {/* Abstract Shape Mask Placeholder */}
               <div className="absolute inset-0 bg-gray-200 rounded-[70%_30%_30%_70%_/_70%_70%_30%_30%] overflow-hidden border-4 border-white shadow-xl">
                  {/* Placeholder for Family Image */}
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <span className="text-gray-400 font-medium">Happy Learner Image</span>
                  </div>
               </div>
               
               {/* Decorative Elements */}
               <div className="absolute top-10 left-0 w-12 h-12 bg-yellow-400 rounded-full"></div>
               <div className="absolute bottom-10 right-10 w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>

            <h2 className="text-xl font-bold text-[#0a0a4a] mb-8 text-center">
              Continue your learning journey.
            </h2>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-6 rounded-2xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
