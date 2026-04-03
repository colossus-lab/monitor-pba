import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ChartCard from '../charts/ChartCard';

const SaludView = () => {
  const [camasData, setCamasData] = useState([]);
  const [nacimientosData, setNacimientosData] = useState([]);

  useEffect(() => {
    fetch('/data/salud_camas_trend.json')
      .then(res => res.json())
      .then(setCamasData)
      .catch(console.error);

    fetch('/data/salud_nacimientos_trend.json')
      .then(res => res.json())
      .then(setNacimientosData)
      .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Salud Pública</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Monitoreo de la capacidad resolutiva del sistema hospitalario (camas críticas) 
          y dinámica demográfica provincial a través de la tasa de natalidad y mortalidad.
        </p>
      </div>

      <div className="charts-grid">
        <ChartCard 
          title="Capacidad Hospitalaria" 
          subtitle="Evolución de camas críticas y de cuidados intensivos"
          icon="🏥"
          color="#3b82f6"
          loading={camasData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={camasData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCamas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#3b82f6' }}
                formatter={(value) => [new Intl.NumberFormat('es-AR').format(value), 'Camas']}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCamas)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Dinámica Poblacional Vital" 
          subtitle="Relación entre nacimientos y defunciones anuales"
          icon="🧬"
          color="#ec4899"
          loading={nacimientosData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={nacimientosData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNac" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDef" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="nacimientos" name="Nacimientos" stroke="#ec4899" strokeWidth={3} fill="url(#colorNac)" fillOpacity={0.5} />
              <Area type="monotone" dataKey="defunciones" name="Defunciones" stroke="#ef4444" strokeWidth={3} fill="url(#colorDef)" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default SaludView;
