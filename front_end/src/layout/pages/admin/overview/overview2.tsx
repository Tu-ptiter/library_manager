import { useEffect, useState } from 'react';
import { Book, Users, BookOpen, Target } from 'lucide-react';
import { fetchTotalBooks, countMembers, countBorrowedBooks } from '@/api/api';
import StatsCard from '@/components/ui/starts-card';
import BookStats from './charts/BookStats';
import UserStats from './charts/UserStats';
import BorrowStats from './charts/BorrowStats';
import CategoryDistribution from './charts/CategoryDistribution';

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
    <div className="p-6">
  <div className="mb-8">
    <h1 className="text-2xl font-bold mb-2">Tổng quan thư viện</h1>
    <p className="text-gray-600">
      Theo dõi số liệu thống kê của thư viện theo thời gian thực
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatsCard
      title="Tổng số sách"
      value={displayedTotal.toLocaleString()}
      icon={<Book className="h-7 w-7 text-blue-600" />}
      iconColor="bg-blue-100"
      trend={{ value: 12, isPositive: true }}
    />
    <StatsCard
      title="Người dùng hoạt động"
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
      title="Tỷ lệ hoàn thành"
      value="92%"
      icon={<Target className="h-7 w-7 text-emerald-600" />}
      iconColor="bg-emerald-100"
      trend={{ value: 2, isPositive: true }}
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Thống kê sách</h2>
      <BookStats />
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Thống kê mượn trả</h2>
      <BorrowStats />
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Thống kê người dùng</h2>
      <UserStats />
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Phân bố danh mục</h2>
      <CategoryDistribution />
    </div>
  </div>
</div>
  );
}