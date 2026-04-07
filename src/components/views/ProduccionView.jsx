import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ChartCard from '../charts/ChartCard';

const ProduccionView = () => {
  const [recaudacionData, setRecaudacionData] = useState([]);
  const [isimData, setIsimData] = useState([]);

  useEffect(() => {
    fetch('/data/produccion_recaudacion_trend.json')
      .then(res => res.json())
      .then(setRecaudacionData)
      .catch(console.error);

    fetch('/data/produccion_isim.json')
      .then(res => res.json())
      .then(setIsimData)
      .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Producción y Economía</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Seguimiento de los indicadores macroeconómicos provinciales: recaudación fiscal e 
          Índice Sintético de la Industria Manufacturera (ISIM-PBA).
        </p>
      </div>

      <div className="charts-grid">
        <ChartCard 
          title="Recaudación Fiscal" 
          subtitle="Evolución nominal histórica (en miles de pesos)"
          icon="📈"
          color="#14b8a6"
          loading={recaudacionData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={recaudacionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRecaudacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#14b8a6' }}
                formatter={(value) => [`$${new Intl.NumberFormat('es-AR').format(value)}k`, 'Recaudación']}
              />
              <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fill="url(#colorRecaudacion)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Actividad Industrial (ISIM-PBA)" 
          subtitle="Variación interanual de la industria manufacturera"
          icon="🏭"
          color="#a855f7"
          loading={isimData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={isimData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#a855f7' }}
                formatter={(value) => [`${value}%`, 'Variación i.a.']}
              />
              <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default React.memo(ProduccionView);
