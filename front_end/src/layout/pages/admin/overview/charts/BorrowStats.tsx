// BorrowStats.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchTransactionStats } from '@/api/api';

interface StatData {
  month: string;
  borrow: number;
  return: number;
}

const BorrowStats: React.FC = () => {
  const [data, setData] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await fetchTransactionStats();
        setData(stats);
        setLoading(false);
      } catch (err) {
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="borrow" 
            stroke="#8884d8" 
            name="Số lượt mượn" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="return" 
            stroke="#82ca9d" 
            name="Số lượt trả"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowStats;