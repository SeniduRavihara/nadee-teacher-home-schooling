import { BarChart2, Download, PieChart, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Detailed insights into platform performance</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Progress Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Student Progress
            </h2>
            <select className="bg-gray-50 border-none text-sm rounded-lg p-2">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400 font-medium">Line Chart Visualization</span>
          </div>
        </div>

        {/* Subject Distribution Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChart size={20} className="text-purple-500" />
              Subject Distribution
            </h2>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400 font-medium">Pie Chart Visualization</span>
          </div>
        </div>

        {/* Quiz Performance Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 size={20} className="text-green-500" />
              Quiz Performance by Grade
            </h2>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400 font-medium">Bar Chart Visualization</span>
          </div>
        </div>
      </div>
    </div>
  );
}
