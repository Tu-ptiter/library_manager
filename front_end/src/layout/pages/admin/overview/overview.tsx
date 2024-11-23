// layout/pages/admin/overview/overview.tsx
import { useState, useEffect } from 'react';
import { Book, Users, BookOpen, Target } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { fetchTotalBooks, countMembers, countBorrowedBooks, countReturnedBooks } from '@/api/api';
import StatsCard from '@/components/ui/starts-card';
import { BookStats, UserStats, BorrowStats, CategoryDistribution } from './charts';

interface Stats {
  totalBooks: number;
  activeUsers: number;
  borrowedBooks: number;
  returnedBooks: number;
}

export default function Overview() {
  // Combined stats state
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    activeUsers: 0,
    borrowedBooks: 0,
    returnedBooks: 0
  });

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animated display states
  const [displayedStats, setDisplayedStats] = useState<Stats>({
    totalBooks: 0,
    activeUsers: 0,
    borrowedBooks: 0,
    returnedBooks: 0 
  });

  // Animation utility function
  const animateValue = (
    startValue: number,
    endValue: number,
    duration: number,
    setValue: (value: number) => void
  ) => {
    if (endValue === 0) {
      setValue(0);
      return;
    }

    const steps = 30;
    const increment = endValue / steps;
    let current = startValue;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setValue(endValue);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, duration / steps);

    return timer;
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [books, users, borrowed, returned] = await Promise.allSettled([
          fetchTotalBooks(),
          countMembers(),
          countBorrowedBooks(),
          countReturnedBooks()
        ]);

        setStats({
          totalBooks: books.status === 'fulfilled' ? books.value : 0,
          activeUsers: users.status === 'fulfilled' ? users.value : 0,
          borrowedBooks: borrowed.status === 'fulfilled' ? borrowed.value : 0,
          returnedBooks: returned.status === 'fulfilled' ? returned.value : 0 
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Không thể tải dữ liệu thống kê');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation effects
  useEffect(() => {
    const timers: number[] = [];

    if (stats.totalBooks > 0) {
      timers.push(animateValue(0, stats.totalBooks, 1500, 
        (value) => setDisplayedStats(prev => ({ ...prev, totalBooks: value })))!);
    }
    if (stats.activeUsers > 0) {
      timers.push(animateValue(0, stats.activeUsers, 1500,
        (value) => setDisplayedStats(prev => ({ ...prev, activeUsers: value })))!);
    }
    if (stats.borrowedBooks > 0) {
      timers.push(animateValue(0, stats.borrowedBooks, 1500,
        (value) => setDisplayedStats(prev => ({ ...prev, borrowedBooks: value })))!);
    }
    if (stats.returnedBooks > 0) {
      timers.push(animateValue(0, stats.returnedBooks, 1500,
        (value) => setDisplayedStats(prev => ({ ...prev, returnedBooks: value })))!);
    }

    return () => timers.forEach(timer => clearInterval(timer));
  }, [stats]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

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
            value={displayedStats.totalBooks.toLocaleString()}
            icon={<Book className="h-7 w-7 text-blue-600" />}
            iconColor="bg-blue-100"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Số bạn đọc"
            value={displayedStats.activeUsers.toLocaleString()}
            icon={<Users className="h-7 w-7 text-purple-600" />}
            iconColor="bg-purple-100"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Sách đang mượn"
            value={displayedStats.borrowedBooks.toLocaleString()}
            icon={<BookOpen className="h-7 w-7 text-orange-600" />}
            iconColor="bg-orange-100"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Số sách đã trả"
            value={displayedStats.returnedBooks.toLocaleString()}
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
}