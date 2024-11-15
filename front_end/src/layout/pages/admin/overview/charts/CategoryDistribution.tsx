import { useEffect, useState } from 'react';
import { fetchCategoryDistribution } from '@/api/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


const COLORS = [
  '#0088FE',  // Blue
  '#00C49F',  // Green
  '#FFBB28',  // Yellow
  '#FF8042',  // Orange
  '#8884d8',  // Purple
  '#82ca9d',  // Light green
  '#ff7c43',  // Coral
  '#a05195',  // Magenta
  '#665191',  // Deep purple
];

const CategoryDistribution = () => {
  const [data, setData] = useState<{ name: string; value: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const distribution = await fetchCategoryDistribution();
        const formattedData = Object.entries(distribution).map(([name, value]) => ({
          name,
          value
        }));
        setData(formattedData);
      } catch (err) {
        setError('Failed to load category distribution');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
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