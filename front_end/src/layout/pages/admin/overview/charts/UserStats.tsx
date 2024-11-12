// layout/pages/admin/overview/charts/UserStats.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T1', new: 40, active: 240 },
  { name: 'T2', new: 30, active: 210 },
  { name: 'T3', new: 60, active: 280 },
  { name: 'T4', new: 80, active: 250 },
  { name: 'T5', new: 50, active: 290 },
  { name: 'T6', new: 75, active: 300 },
];

const UserStats: React.FC = () => {
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