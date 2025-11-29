import FadeIn from './animations/FadeIn';

export default function Stats() {
  const stats = [
    { label: 'Young Learners', value: '25,000+' },
    { label: 'English & Phonics Skills', value: '300+' },
    { label: 'Trusted Parents & Educators', value: '4,500+' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Set 2: Suitable for Early-Childhood / English Teaching</h2>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <FadeIn key={index} delay={index * 0.2} direction="up" className="h-full">
              <div className="p-6 h-full">
                <div className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium uppercase tracking-wide text-sm">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
