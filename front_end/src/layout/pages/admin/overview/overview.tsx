// layout/pages/admin/overview/overview.tsx
import { useState, useEffect } from 'react';
import { Book, Users, BookOpen, Target } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { fetchTotalBooks, countMembers, countBorrowedBooks } from '@/api/api';
import StatsCard from '@/components/ui/starts-card';
import { BookStats, UserStats, BorrowStats, CategoryDistribution } from './charts';

export default function Overview() {
  // State for real values
  const [totalBooks, setTotalBooks] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);

  // State for animated displays
  const [displayedTotal, setDisplayedTotal] = useState(0);
  const [displayedUsers, setDisplayedUsers] = useState(0);
  const [displayedBorrowed, setDisplayedBorrowed] = useState(0);

  // Animation utility function
  const animateValue = (
    startValue: number,
    endValue: number,
    duration: number,
    setValue: (value: number) => void
  ) => {
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
        const [books, users, borrowed] = await Promise.all([
          fetchTotalBooks(),
          countMembers(),
          countBorrowedBooks()
        ]);
        setTotalBooks(books);
        setActiveUsers(users);
        setBorrowedBooks(borrowed);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, []);

  // Animation effects
  useEffect(() => {
    if (totalBooks > 0) {
      const timer = animateValue(0, totalBooks, 1500, setDisplayedTotal);
      return () => clearInterval(timer);
    }
  }, [totalBooks]);

  useEffect(() => {
    if (activeUsers > 0) {
      const timer = animateValue(0, activeUsers, 1500, setDisplayedUsers);
      return () => clearInterval(timer);
    }
  }, [activeUsers]);

  useEffect(() => {
    if (borrowedBooks > 0) {
      const timer = animateValue(0, borrowedBooks, 1500, setDisplayedBorrowed);
      return () => clearInterval(timer);
    }
  }, [borrowedBooks]);


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
            title="Số bạn đọc"
            value={displayedUsers.toLocaleString()}
            icon={<Users className="h-7 w-7 text-purple-600" />}
            iconColor="bg-purple-100"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Sách đang mượn"
            value={displayedBorrowed.toLocaleString()}
            icon={<BookOpen className="h-7 w-7 text-orange-600" />}
            iconColor="bg-orange-100"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Số sách đã trả"
            value="333"
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