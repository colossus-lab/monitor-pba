import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import ChartCard from '../charts/ChartCard';

const InfraestructuraView = () => {
  const [puertosData, setPuertosData] = useState([]);
  const [obrasEstadoData, setObrasEstadoData] = useState([]);

  useEffect(() => {
    fetch('/data/infraestructura_puertos.json')
      .then(res => res.json())
      .then(setPuertosData)
      .catch(console.error);

    fetch('/data/infraestructura_obras_estado.json')
      .then(res => res.json())
      .then(setObrasEstadoData)
      .catch(console.error);
  }, []);

  const PIE_COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-3">Infraestructura y Servicios P.</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Evaluación del volumen logístico portuario bonaerense frente al estado crítico de la 
          ejecución de obras públicas según la jurisdicción (Nación vs Provincia).
        </p>
      </div>

      <div className="charts-grid">
        <ChartCard 
          title="Logística y Puertos Públicos" 
          subtitle="Capacidad de movilización por Consorcio de Gestión (Toneladas)"
          icon="🚢"
          color="#0ea5e9"
          loading={puertosData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={puertosData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
                formatter={(value) => [new Intl.NumberFormat('es-AR').format(value), 'Toneladas']}
              />
              <Bar dataKey="toneladas" name="Toneladas" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Estado Obras Públicas 2026" 
          subtitle="Obras Activas PBA vs Desfinanciadas por Nación"
          icon="🚧"
          color="#f43f5e"
          loading={obrasEstadoData.length === 0}
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={obrasEstadoData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="cantidad"
                nameKey="estado"
              >
                {obrasEstadoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
                formatter={(value) => [value, 'Obras']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
            {obrasEstadoData.map((entry, index) => (
              <div key={entry.estado} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{entry.estado}: <strong style={{ color: '#fff' }}>{entry.cantidad}</strong></span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default React.memo(InfraestructuraView);
