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
  <Card className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
    transition-all duration-300 border border-gray-200/50 rounded-lg shadow-sm hover:shadow
    group overflow-hidden">
    <div className="flex items-center justify-between relative">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1.5 text-sm
            ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            <span className="font-medium">
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500">vs tháng trước</span>
          </div>
        )}
      </div>
      <div className={`${iconColor} p-4 rounded-xl transition-transform duration-300 
        group-hover:scale-110 group-hover:rotate-[-3deg]`}>
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
    <div className="bg-white mt-5">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-200/50">
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan thư viện</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Tổng số sách"
            value={displayedTotal.toLocaleString()}
            icon={<Book className="h-7 w-7 text-blue-600" />}
            iconColor="bg-blue-100"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Số lượng bạn đọc"
            value="856"
            icon={<Users className="h-7 w-7 text-purple-600" />}
            iconColor="bg-purple-100"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Sách đang mượn"
            value="342"
            icon={<BookOpen className="h-7 w-7 text-orange-600" />}
            iconColor="bg-orange-100"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Tỷ lệ hoàn thành"
            value="92%"
            icon={<Target className="h-7 w-7 text-emerald-600" />}
            iconColor="bg-emerald-100"
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
            transition-all duration-300 rounded-lg shadow-sm hover:shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Thống kê mượn sách</h3>
            <div className="h-[300px]">
              <BorrowStats />
            </div>
          </Card>
          <Card className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
            transition-all duration-300 rounded-lg shadow-sm hover:shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Thống kê sách</h3>
            <div className="h-[300px]">
              <BookStats />
            </div>
          </Card>
          <Card className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
            transition-all duration-300 rounded-lg shadow-sm hover:shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Thống kê người dùng</h3>
            <div className="h-[300px]">
              <UserStats />
            </div>
          </Card>
          <Card className="p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 
            transition-all duration-300 rounded-lg shadow-sm hover:shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Phân bố danh mục</h3>
            <div className="h-[300px]">
              <CategoryDistribution />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;