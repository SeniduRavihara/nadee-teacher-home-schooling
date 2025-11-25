import { Calendar, Clock, User, Video } from 'lucide-react';

export default function StudentClassesPage() {
  const classes = [
    {
      id: 1,
      title: 'Advanced Math Concepts',
      instructor: 'Mr. Smith',
      date: 'Today',
      time: '10:00 AM',
      duration: '45 mins',
      status: 'Live',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Creative Writing Workshop',
      instructor: 'Ms. Johnson',
      date: 'Today',
      time: '02:00 PM',
      duration: '60 mins',
      status: 'Upcoming',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      id: 3,
      title: 'Science Experiments Live',
      instructor: 'Dr. Brown',
      date: 'Tomorrow',
      time: '11:00 AM',
      duration: '45 mins',
      status: 'Upcoming',
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'History: Ancient Civilizations',
      instructor: 'Mrs. Davis',
      date: 'Nov 28',
      time: '01:00 PM',
      duration: '50 mins',
      status: 'Upcoming',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Online Classes</h1>
        <p className="text-gray-500">Join live sessions with your teachers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${cls.color}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${cls.lightColor} ${cls.textColor}`}>
                  {cls.status}
                </span>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <Video size={16} />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cls.title}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={16} />
                  <span>{cls.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{cls.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{cls.time} • {cls.duration}</span>
                </div>
              </div>

              <button 
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  cls.status === 'Live' 
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={cls.status !== 'Live'}
              >
                {cls.status === 'Live' ? 'Join Now' : 'Join Class'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
