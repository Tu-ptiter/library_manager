// layout/pages/admin/overview/charts/BookStats.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T1', total: 7720, borrowed: 2400 },
  { name: 'T2', total: 7750, borrowed: 2600 },
  { name: 'T3', total: 7770, borrowed: 2800 },
  { name: 'T4', total: 7780, borrowed: 3000 },
  { name: 'T5', total: 8000, borrowed: 3200 },
  { name: 'T6', total: 9353, borrowed: 3500 },
  { name: 'T7', total: 9443, borrowed: 3800 },
  { name: 'T8', total: 9543, borrowed: 4000 },
  { name: 'T9', total: 9553, borrowed: 4200 },
  { name: 'T10', total: 9600, borrowed: 4400 },
  { name: 'T11', total: 9653, borrowed: 4600 },
  
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