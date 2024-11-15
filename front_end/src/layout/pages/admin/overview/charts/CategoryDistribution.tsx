// layout/pages/admin/overview/charts/CategoryDistribution.tsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryDistribution } from '@/api/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', 
  '#8dd1e1', '#a4de6c', '#d0ed57', '#a28fd0', '#ff7f50', '#87cefa', '#da70d6', 
  '#32cd32', '#6495ed', '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa07a'
];
const CategoryDistribution: React.FC = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const distribution = await getCategoryDistribution();
        // Transform object into array format expected by recharts
        const transformedData = Object.entries(distribution).map(([name, value]) => ({
          name,
          value: Number(value)
        }));
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching category distribution:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryDistribution;