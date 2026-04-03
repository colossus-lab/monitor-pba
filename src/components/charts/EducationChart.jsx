import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ChartCard from './ChartCard';

const EducationChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/educacion_trend.json')
      .then(res => res.json())
      .then(json => {
        // Promediamos el rendimiento por año independientemente de la materia para ver tendencia general
        const yearGroups = json.reduce((acc, curr) => {
          if (!acc[curr.year]) {
            acc[curr.year] = { count: 0, sum: 0 };
          }
          acc[curr.year].sum += curr.positive_percentage;
          acc[curr.year].count += 1;
          return acc;
        }, {});
        
        const formatted = Object.keys(yearGroups).map(year => ({
          year: parseInt(year),
          average: Number((yearGroups[year].sum / yearGroups[year].count).toFixed(2))
        })).sort((a,b) => a.year - b.year);

        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading education data", err);
        setLoading(false);
      });
  }, []);

  return (
    <ChartCard 
      title="Calidad Educativa" 
      subtitle="Resultados Aprender (Satisfactorio/Avanzado %)"
      icon="📚"
      color="#f59e0b"
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis 
            domain={[0, 100]} 
            stroke="rgba(255,255,255,0.4)" 
            fontSize={12} 
            tickMargin={10} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#f59e0b' }}
            formatter={(value) => [`${value}%`, 'Rendimiento Positivo']}
          />
          <Line type="monotone" dataKey="average" stroke="#f59e0b" strokeWidth={3} dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: '#0f172a' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default EducationChart;
