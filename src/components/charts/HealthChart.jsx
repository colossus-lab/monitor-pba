import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import ChartCard from './ChartCard';

const HealthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/camas_trend.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading health data", err);
        setLoading(false);
      });
  }, []);

  return (
    <ChartCard 
      title="Salud Pública" 
      subtitle="Evolución de camas críticas disponibles (2018-2023)"
      icon="🏥"
      color="#3b82f6"
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}}
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#3b82f6' }}
            formatter={(value) => [new Intl.NumberFormat('es-AR').format(value), 'Camas Críticas']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8 + (index / data.length) * 0.2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default HealthChart;
