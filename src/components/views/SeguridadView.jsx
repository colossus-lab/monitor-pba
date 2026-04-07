import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import ChartCard from '../charts/ChartCard';

const SeguridadView = () => {
  const [snicData, setSnicData] = useState([]);
  const [presenciaData, setPresenciaData] = useState([]);

  useEffect(() => {
    fetch('/data/seguridad_snic_trend.json')
      .then(res => res.json())
      .then(setSnicData)
      .catch(console.error);

    fetch('/data/seguridad_presencia.json')
      .then(res => res.json())
      .then(setPresenciaData)
      .catch(console.error);
  }, []);

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd'];

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Seguridad y Justicia</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Análisis transversal de la evolución delictual (SNIC) contrastada con la presencia efectiva 
          de fuerzas de seguridad y el sistema penitenciario bonaerense.
        </p>
      </div>

      <div className="charts-grid">
        <ChartCard 
          title="Evolución de Hechos Delictivos" 
          subtitle="Hechos registrados según Sistema Nacional de Información Criminal (SNIC)"
          icon="🛡️"
          color="#ef4444"
          loading={snicData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={snicData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSnic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#ef4444' }}
                formatter={(value) => [new Intl.NumberFormat('es-AR').format(value), 'Hechos']}
              />
              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fill="url(#colorSnic)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Infraestructura de Seguridad" 
          subtitle="Presencia territorial de Comisarías y Unidades Penitenciarias"
          icon="🏢"
          color="#3b82f6"
          loading={presenciaData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={presenciaData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={12} tickLine={false} axisLine={false} width={120} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {presenciaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default React.memo(SeguridadView);
