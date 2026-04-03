import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ChartCard from './ChartCard';

const JusticeChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/llamadas_148_trend.json')
      .then(res => res.json())
      .then(json => {
        const formatted = json.map(item => ({
          ...item,
          period: `${item.year}-${String(item.month).padStart(2, '0')}`
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading justice data", err);
        setLoading(false);
      });
  }, []);

  return (
    <ChartCard 
      title="Seguridad y Protección" 
      subtitle="Intervenciones en Línea 148 (Mensual)"
      icon="🛡️"
      color="#8b5cf6"
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorJustice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            itemStyle={{ color: '#8b5cf6' }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
            formatter={(value) => [new Intl.NumberFormat('es-AR').format(value), 'Casos Registrados']}
          />
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorJustice)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default JusticeChart;
