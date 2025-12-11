import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({ title, value, change, isPositive, icon: Icon, color }: StatCardProps) {
  // Map background colors to text colors
  const getIconColors = (bgColor: string) => {
    switch(bgColor) {
      case 'bg-blue-500':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'bg-purple-500':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'bg-orange-500':
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
      case 'bg-green-500':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const iconColors = getIconColors(color);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${iconColors.bg}`}>
          <Icon className={`w-6 h-6 ${iconColors.text}`} />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
