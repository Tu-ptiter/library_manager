// layout/pages/admin/overview/overview.tsx
import React, { useState, useEffect } from 'react';
import { Book, Users, BookOpen, Target } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { fetchTotalBooks } from '@/api/api';
import { BookStats, UserStats, BorrowStats, CategoryDistribution } from './charts';

interface TrendProps {
  value: number;
  isPositive: boolean;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: TrendProps;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, iconColor }) => (
  <Card className="p-6 rounded-none">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold mt-2">{value}</h3>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% so với tháng trước
          </p>
        )}
      </div>
      <div className={`p-3 ${iconColor} rounded-full`}>
        {icon}
      </div>
    </div>
  </Card>
);

const Overview: React.FC = () => {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [displayedTotal, setDisplayedTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total = await fetchTotalBooks();
        setTotalBooks(total);
      } catch (error) {
        console.error('Error fetching total books:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (totalBooks > 0) {
      const duration = 1500;
      const steps = 30;
      const increment = totalBooks / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= totalBooks) {
          setDisplayedTotal(totalBooks);
          clearInterval(timer);
        } else {
          setDisplayedTotal(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [totalBooks]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng số sách"
          value={displayedTotal.toLocaleString()}
          icon={<Book className="h-6 w-6 text-blue-600" />}
          iconColor="bg-blue-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Người dùng hoạt động"
          value="856"
          icon={<Users className="h-6 w-6 text-purple-600" />}
          iconColor="bg-purple-100"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Sách đang mượn"
          value="342"
          icon={<BookOpen className="h-6 w-6 text-orange-600" />}
          iconColor="bg-orange-100"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Tỷ lệ hoàn thành"
          value="92%"
          icon={<Target className="h-6 w-6 text-green-600" />}
          iconColor="bg-green-100"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-semibold mb-4">Thống kê mượn sách</h3>
          <BorrowStats />
        </Card>
        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-semibold mb-4">Thống kê mượn sách</h3>
          <BookStats />
        </Card>
        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-semibold mb-4">Thống kê người dùng</h3>
          <UserStats />
        </Card>
        <Card className="p-6 rounded-none">
          <h3 className="text-lg font-semibold mb-4">Phân bố danh mục</h3>
          <CategoryDistribution />
        </Card>
      </div>
    </div>
  );
};

export default Overview;