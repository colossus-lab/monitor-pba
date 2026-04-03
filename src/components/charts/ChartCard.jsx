import React from 'react';
import './ChartCard.css';

const ChartCard = ({ title, subtitle, icon, color, children, loading }) => {
  return (
    <div className="stat-card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
      <div className="chart-header">
        <div 
          className="chart-icon-container"
          style={{ 
            color: color || '#fff',
            boxShadow: `0 0 15px ${color}33`,
            backgroundColor: `${color}15`,
            borderColor: `${color}30`
          }}
        >
          {icon}
        </div>
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <div className="chart-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="chart-loading">Cargando datos...</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
