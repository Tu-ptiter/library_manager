// layout/pages/admin/overview/charts/UserStats.tsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchMemberStatistics, MemberStatistics } from '@/api/api';

const UserStats: React.FC = () => {
  const [data, setData] = useState<MemberStatistics[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const statistics = await fetchMemberStatistics();
        setData(statistics);
      } catch (error) {
        console.error('Error fetching member statistics:', error);
      }
    };

    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="new" fill="#82ca9d" name="Người dùng mới" />
        <Bar dataKey="active" fill="#8884d8" name="Người dùng hoạt động" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserStats;