import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

function DashboardSummary({ data }) {
  // Aggregate data for KPIs
  const totalCategories = data.length;
  const totalDatasets = data.reduce((acc, cat) => acc + cat.datasets.length, 0);
  
  
  const totalPBA = data.reduce((acc, cat) => acc + cat.datasets.filter(d => d.type === 'pba').length, 0);
  const totalNacional = data.reduce((acc, cat) => acc + cat.datasets.filter(d => d.type === 'abiertos').length, 0);

  const chartData = data.map(cat => {
    const pba = cat.datasets.filter(d => d.type === 'pba').length;
    const nac = cat.datasets.filter(d => d.type === 'abiertos').length;
    
    return {
      name: cat.category,
      Total: cat.datasets.length,
      PBA: pba,
      Nacional: nac
    };
  }).sort((a, b) => b.Total - a.Total);

  const dynamicHeight = Math.max(400, chartData.length * 70);

  return (
    <div className="dashboard-summary fade-in">
      <div className="hero-section" style={{ padding: '0', textAlign: 'left', marginBottom: '2rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Monitor de <span className="gradient-text">Datos Abiertos PBA</span>
        </h1>
        <p className="hero-subtitle" style={{ margin: '1rem 0' }}>
          Inventario jerárquico de activos de información pública.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="stat-card">
          <div className="stat-value text-blue">{totalDatasets}</div>
          <div className="stat-label">Total de Datasets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-emerald">{totalCategories}</div>
          <div className="stat-label">Áreas Temáticas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-purple">{totalPBA}</div>
          <div className="stat-label">Portal PBA</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-orange">{totalNacional}</div>
          <div className="stat-label">Datos Nacionales Referenciados</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container" style={{ marginTop: '3rem', height: `${dynamicHeight}px`, minHeight: '400px', padding: '1.5rem', background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Distribución por Tema</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <XAxis type="number" stroke="var(--text-secondary)" />
            <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={280} tick={{fontSize: 12}} />
            <Tooltip 
              cursor={{fill: 'var(--hover-bg)'}} 
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="PBA" fill="#10b981" radius={[0, 4, 4, 0]} name="Portal PBA" />
            <Bar dataKey="Nacional" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Nacional" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardSummary;
