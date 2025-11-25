import { Check } from 'lucide-react';

export default function ProgressReports() {
  const features = [
    'Daily progress reports',
    'Skill mastery tracking',
    'Personalized practice packs',
    'Parent dashboard access',
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The most comprehensive progress reports ever. Period.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Stay on top of your child's learning with detailed insights and reports delivered straight to your inbox.
            </p>
            
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="mt-8 bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors">
              See how it works
            </button>
          </div>

          {/* Dashboard Mockup */}
          <div className="order-1 lg:order-2 relative">
             <div className="relative w-full aspect-[4/3] bg-blue-50 rounded-3xl p-6 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mockup UI */}
                <div className="bg-white w-full h-full rounded-2xl shadow-inner p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b pb-4">
                        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2 h-32 bg-blue-100 rounded-xl"></div>
                        <div className="w-1/2 h-32 bg-purple-100 rounded-xl"></div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4">
                        <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                        100%
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Weekly Goal</div>
                        <div className="font-bold text-gray-900">Achieved!</div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
