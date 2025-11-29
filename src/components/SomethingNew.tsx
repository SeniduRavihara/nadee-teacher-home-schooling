import { Calendar, ClipboardList, FileText } from 'lucide-react';
import FadeIn from './animations/FadeIn';

export default function SomethingNew() {
  const features = [
    {
      icon: <ClipboardList size={40} className="text-blue-500" />,
      title: 'Quizzes',
      description: 'Fun educational quizzes for Math & Reading skills.',
      color: 'bg-blue-50',
    },
    {
      icon: <FileText size={40} className="text-orange-500" />,
      title: 'Video Lessons',
      description: 'Engaging video lessons for every topic.',
      color: 'bg-orange-50',
    },
    {
      icon: <Calendar size={40} className="text-green-500" />,
      title: 'Live Classes',
      description: 'Interactive classes with expert teachers.',
      color: 'bg-green-50',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Something new to choose from, every day
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A wide variety of learning resources to keep your child engaged and excited.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.2} direction="up" className="h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-24 h-24 ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm px-4">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.6} direction="up">
          <div className="text-center mt-12">
              <button className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors">
                  Get Started
              </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
