import React, { useState, useEffect } from 'react';
import dbMap from '../data/db_mapping_key.json';

const DataExplorer = ({ resourceUrl, resourceName, onClose }) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  const tableName = dbMap[resourceUrl];

  useEffect(() => {
    if (!tableName) {
      setError("Este archivo aún no fue inyectado en la base de datos Postgres.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/data?table=${tableName}&page=${page}&limit=${limit}`);
        const result = await response.json();
        
        if (response.ok) {
          setData(result.data);
          setMeta(result.meta);
        } else {
          setError(result.error || "Ocurrió un error consultando la DB.");
        }
      } catch (e) {
        setError("Error de red. ¿Estás corriendo el entorno con Vercel ('npx vercel dev') en vez de Vite solo?");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, page]);

  // Si no hay información de columnas, extraemos del primer registro
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="data-explorer-container">
        
        {/* Cabecera del Navegador de Base de Datos */}
        <div className="explorer-header">
          <div>
            <h2>
              Explorador de Base de Datos
            </h2>
            <p>
              {resourceName} <span className="opacity-50">({tableName || 'No tabla'})</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="explorer-close-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo / Tabla */}
        <div className="explorer-body">
          {loading && (
            <div className="explorer-loader">
              <div className="explorer-loader-spinner"></div>
            </div>
          )}

          {error && (
            <div className="empty-state-wrapper">
              <div className="empty-state-icon" style={{backgroundColor: 'rgba(255,0,0,0.1)', color: '#ef4444'}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="empty-state-title">No se pudo cargar la data</h3>
              <p className="empty-state-text">{error}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="empty-state-wrapper">
               <h3 className="empty-state-title">Tabla Vacía</h3>
               <p className="empty-state-text">La tabla existe pero no devolvió registros.</p>
            </div>
          )}

          {!error && data.length > 0 && (
            <table className="explorer-table">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, r_idx) => (
                  <tr key={r_idx}>
                    {columns.map((col, c_idx) => (
                      <td key={c_idx} title={row[col]?.toString()}>
                        {row[col] !== null && row[col] !== undefined ? row[col].toString() : <span style={{opacity: 0.3}}>NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación Footer */}
        {meta && (
          <div className="explorer-footer">
            <span style={{ color: 'var(--text-secondary)' }}>
              Mostrando página <b style={{color: 'var(--text-primary)'}}>{meta.page}</b> de <b style={{color: 'var(--text-primary)'}}>{meta.totalPages}</b> (Total: {meta.total.toLocaleString()} registros)
            </span>
            <div>
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="explorer-pagination-btn"
              >
                Anterior
              </button>
              <button 
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                className="explorer-pagination-btn primary"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default DataExplorer;
