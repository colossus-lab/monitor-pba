import React, { useState } from 'react';
import DataExplorer from './DataExplorer';
import dbMap from '../data/db_mapping_key.json';

function DatasetCard({ dataset, isExpanded, onToggleExpand }) {
  const targetTable = dbMap[dataset.key];

  return (
    <div className={`dataset-card-wrapper ${isExpanded ? 'expanded' : ''}`} style={isExpanded ? { gridColumn: '1 / -1' } : {}}>
    <div className="dataset-card">
      <div className="card-header">
        <h4 className="card-title">{dataset.title}</h4>
        <span className={`tag ${dataset.type === 'pba' ? 'tag-pba' : 'tag-abiertos'}`}>
          {dataset.type === 'pba' ? 'Portal PBA' : 'Nacional'}
        </span>
      </div>
      
      <div className="card-body">
        {dataset.type === 'pba' ? (
          <>
            <p className="card-org"><strong>Organización:</strong> {dataset.org}</p>
            <p className="card-desc">{dataset.desc || 'Sin descripción detallada.'}</p>
          </>
        ) : (
          <>
            <p className="card-org"><strong>Recursos Nacionales relevantes:</strong></p>
            <ul className="resources-list">
              {dataset.resources && dataset.resources.slice(0, 3).map((res, idx) => (
                <li key={idx}>{res}</li>
              ))}
              {dataset.resources && dataset.resources.length > 3 && (<li>...</li>)}
            </ul>
          </>
        )}
      </div>
      
      <div className="card-footer">
        <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>ID: {dataset.key}</span>
        
        {targetTable && (
          <button 
            onClick={onToggleExpand}
            className="explore-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            {isExpanded ? 'Cerrar DB' : 'Explorar DB'}
          </button>
        )}
      </div>
    </div>

    {isExpanded && (
      <div className="dataset-explorer-wrapper">
        <DataExplorer 
          resourceUrl={dataset.key} 
          resourceName={dataset.title} 
          onClose={onToggleExpand} 
        />
      </div>
    )}
    </div>
  );
}

export default DatasetCard;
