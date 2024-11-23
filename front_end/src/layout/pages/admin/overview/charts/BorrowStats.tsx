// BorrowStats.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BorrowStatsData {
  date: string;
  count: number;
}

const BorrowStats: React.FC = () => {
  const [data, setData] = useState<BorrowStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrowStats = async () => {
      try {
        const response = await axios.get('https://library-mana.azurewebsites.net/transactions/statistics', {
          data: { transactionType: "Trả" }
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching borrow statistics');
        setLoading(false);
      }
    };

    fetchBorrowStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số lượt mượn" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BorrowStats;