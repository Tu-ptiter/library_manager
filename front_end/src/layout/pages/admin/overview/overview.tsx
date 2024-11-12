// layout/pages/admin/overview/overview.tsx
import React from 'react';
import { Card } from "@/components/ui/card";
import { BookStats, UserStats, BorrowStats, CategoryDistribution } from './charts';
import { Book, Target, Users, BookOpen } from 'lucide-react';

const StatsCard = ({ title, value, icon, trend }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% so với tháng trước
          </p>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
  </Card>
);

const Overview: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng số sách"
          value="1,234"
          icon={<Book className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Người dùng hoạt động"
          value="856"
          icon={<Users className="h-6 w-6 text-primary" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Sách đang mượn"
          value="342"
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Tỷ lệ hoàn thành"
          value="92%"
          icon={<Target className="h-6 w-6 text-primary" />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê mượn sách</h3>
          <BorrowStats />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê người dùng</h3>
          <UserStats />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê sách</h3>
          <BookStats />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Phân bố danh mục</h3>
          <CategoryDistribution />
        </Card>
      </div>
    </div>
  );
};

export default Overview;