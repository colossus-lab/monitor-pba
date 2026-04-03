import React from 'react';

function DatasetCard({ dataset }) {
  return (
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
              {dataset.resources && dataset.resources.map((res, idx) => (
                <li key={idx}>• {res}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      
      <div className="card-footer">
        <span style={{fontSize: '0.75rem', color: 'var(--slate-500)'}}>ID: {dataset.key}</span>
      </div>
    </div>
  );
}

export default DatasetCard;
