import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ChartCard from '../charts/ChartCard';

const EducacionView = () => {
  const [obrasData, setObrasData] = useState([]);
  const [inversionData, setInversionData] = useState([]);

  useEffect(() => {
    fetch('/data/educacion_obras_trend.json')
      .then(res => res.json())
      .then(setObrasData)
      .catch(console.error);

    fetch('/data/educacion_inversion.json')
      .then(res => res.json())
      .then(setInversionData)
      .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Educación y Cultura</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Monitor del despliegue estatal en infraestructura educativa, contrastando la creación de nuevos 
          edificios y ampliaciones con las transferencias económicas a consejos escolares por distrito.
        </p>
      </div>

      <div className="charts-grid">
        <ChartCard 
          title="Expansión Edilicia Escolar" 
          subtitle="Nuevos edificios inaugurados vs Ampliaciones (Acumulado Anual)"
          icon="🏫"
          color="#f59e0b"
          loading={obrasData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={obrasData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
              <Bar dataKey="ampliaciones" name="Ampliaciones" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.6} />
              <Line type="monotone" dataKey="nuevas" name="Nuevos Edificios" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Inversión Mantenimiento Escolar" 
          subtitle="Top distritos por Transferencias a Consejos Escolares ($ Millones)"
          icon="💰"
          color="#10b981"
          loading={inversionData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart layout="vertical" data={inversionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="distrito" type="category" stroke="rgba(255,255,255,0.8)" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
                formatter={(value) => [`$${new Intl.NumberFormat('es-AR').format(value)} M`, 'Monto Transferido']}
              />
              <Bar dataKey="monto" name="Monto" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default EducacionView;
