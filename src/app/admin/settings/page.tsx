import { Bell, Globe, Lock, Save, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage platform configuration and preferences</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col">
              <button className="flex items-center gap-3 px-6 py-4 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600">
                <User size={20} />
                Profile Settings
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors">
                <Bell size={20} />
                Notifications
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors">
                <Lock size={20} />
                Security
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors">
                <Globe size={20} />
                Platform
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  defaultValue="User"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                defaultValue="NadeeTeacher"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@nadeeteacher.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
