// layout/pages/admin/overview/charts/BorrowStats.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T1', value: 400 },
  { name: 'T2', value: 300 },
  { name: 'T3', value: 600 },
  { name: 'T4', value: 800 },
  { name: 'T5', value: 500 },
  { name: 'T6', value: 750 },
  { name: 'T7', value: 850 },
  { name: 'T8', value: 650 },
  { name: 'T9', value: 590 },
  { name: 'T10', value: 800 },
  { name: 'T11', value: 900 },
  { name: 'T12', value: 750 },
];

const BorrowStats: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BorrowStats;