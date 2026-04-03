import React, { useState } from 'react';
import './ThemeCard.css';

const ThemeCard = ({ title, datasets, accentColor, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalDatasets = datasets.length;
  const totalResources = datasets.reduce((acc, curr) => acc + curr.count, 0);
  
  // Sort by count descending to show the top ones
  const sortedDatasets = [...datasets].sort((a, b) => b.count - a.count);
  const displayLimit = isExpanded ? sortedDatasets.length : 5;
  const renderDatasets = sortedDatasets.slice(0, displayLimit);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div 
      className="glass-panel theme-card animate-fade-in" 
      style={{ 
        '--theme-accent': accentColor,
        animationDelay: `${delay}s`
      }}
      onClick={toggleExpand}
    >
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        <span className="card-counter">{totalDatasets}</span>
      </div>
      
      <div className="card-subtitle">
        {totalResources} Recursos Totales
      </div>
      
      <div className="dataset-list">
        {renderDatasets.map((ds, index) => (
          <div className="dataset-item" key={index}>
            <span className="dataset-name" title={ds.name}>{ds.name}</span>
            <span className="dataset-resource-count">{ds.count}</span>
          </div>
        ))}
      </div>
      
      {sortedDatasets.length > 5 && (
        <div className="card-footer">
          {isExpanded ? 'Ocultar detalles ▲' : `Ver ${sortedDatasets.length - 5} datasets más ▼`}
        </div>
      )}
    </div>
  );
};

export default ThemeCard;
