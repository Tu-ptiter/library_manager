// layout/pages/admin/overview/charts/BookStats.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T1', total: 4000, borrowed: 2400 },
  { name: 'T2', total: 4200, borrowed: 2600 },
  { name: 'T3', total: 4500, borrowed: 2800 },
  { name: 'T4', total: 4780, borrowed: 3000 },
  { name: 'T5', total: 5000, borrowed: 3200 },
  { name: 'T6', total: 5200, borrowed: 3500 },
];

const BookStats: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" name="Tổng số sách" />
        <Area type="monotone" dataKey="borrowed" stroke="#82ca9d" fill="#82ca9d" name="Sách đang mượn" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BookStats;