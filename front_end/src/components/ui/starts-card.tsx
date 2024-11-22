// components/StatsCard.tsx
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, iconColor, trend }: StatsCardProps) => {
  return (
    <div className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
      transition-all duration-300 rounded-lg shadow-sm hover:shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </span>
          <span className="text-gray-500 text-sm">vs. tháng trước</span>
        </div>
      </div>
      
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatsCard;