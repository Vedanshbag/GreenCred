'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Activity {
  activity_type: string;
  co2_emissions: number;
}

const COLORS = {
  'Transport': '#0088FE',
  'Food': '#00C49F',
  'Energy': '#FFBB28',
  'Offset': '#FF8042',
};

// Helper to categorize activities
const getCategory = (activityType: string) => {
  if (activityType.includes('driving') || activityType.includes('biking')) return 'Transport';
  if (activityType.includes('beef') || activityType.includes('plant')) return 'Food';
  return 'Energy';
}

export default function FootprintChart({ activities }: { activities: Activity[] }) {
  const data = activities
    .filter(a => a.co2_emissions > 0) // Only include emissions, not offsets
    .reduce((acc, activity) => {
      const category = getCategory(activity.activity_type);
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += activity.co2_emissions;
      } else {
        acc.push({ name: category, value: activity.co2_emissions });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-10">Log an activity to see your footprint breakdown.</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO2e`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
