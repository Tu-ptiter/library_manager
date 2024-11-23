import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchWeeklyStats, WeeklyStats } from '@/api/api';

const UserStats: React.FC = () => {
  const [data, setData] = useState<WeeklyStats[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const statistics = await fetchWeeklyStats();
        setData(statistics);
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };

    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" interval={0} dy={10} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="borrowed" fill="#4caf50" name="Sách mượn" />
        <Bar dataKey="returned" fill="#ff5722" name="Sách trả" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserStats;