import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ChartCard from './ChartCard';

const DemographicChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/nacimientos_trend.json')
      .then(res => res.json())
      .then(json => {
        // Formatearemos label YYYY-MM
        const formatted = json.map(item => ({
          ...item,
          period: `${item.year}-${String(item.month).padStart(2, '0')}`
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading demographic data", err);
        setLoading(false);
      });
  }, []);

  return (
    <ChartCard 
      title="Dinámica Poblacional" 
      subtitle="Nacimientos mensuales (2020-2026)"
      icon="👥"
      color="#ec4899"
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="period" 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={10} 
            tickMargin={10} 
            axisLine={false} 
            tickLine={false}
            minTickGap={30}
          />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#ec4899' }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
            formatter={(value) => [value, 'Nacimientos']}
          />
          <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DemographicChart;
