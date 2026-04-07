import React, { useState, useEffect, useCallback } from 'react';
import dbMap from '../data/db_mapping_key.json';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const FETCH_TIMEOUT_MS = 15000;

const DataExplorer = ({ resourceUrl, resourceName, onClose }) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  // M8: fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tableName = dbMap[resourceUrl];

  const fetchData = useCallback(async () => {
    if (!tableName) {
      setError("Este archivo aún no fue inyectado en la base de datos Postgres.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(
        `/api/data?table=${tableName}&page=${page}&limit=${limit}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setMeta(result.meta);
      } else {
        setError(result.error || "Ocurrió un error consultando la DB.");
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        setError("La consulta tardó demasiado. Intentá de nuevo.");
      } else {
        setError("Error de red. ¿Estás corriendo el entorno con Vercel ('npx vercel dev') en vez de Vite solo?");
      }
    } finally {
      setLoading(false);
    }
  }, [tableName, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // M8: cerrar fullscreen con Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  // M3: exportar CSV de la página actual
  const exportCSV = () => {
    if (data.length === 0) return;
    const cols = Object.keys(data[0]);
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [cols.join(','), ...data.map(row => cols.map(c => escape(row[c])).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}_p${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className={`data-explorer-container${isFullscreen ? ' explorer-fullscreen' : ''}`}>

      {/* Cabecera */}
      <div className="explorer-header">
        <div>
          <h2>Explorador de Base de Datos</h2>
          <p>
            {resourceName} <span className="opacity-50">({tableName || 'No tabla'})</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* M3: botón exportar CSV */}
          {!loading && !error && data.length > 0 && (
            <button
              onClick={exportCSV}
              className="explorer-action-btn"
              title="Exportar página actual como CSV"
              aria-label="Exportar página como CSV"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className="hide-mobile">CSV</span>
            </button>
          )}
          {/* M8: botón fullscreen */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="explorer-action-btn"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>
          <button onClick={onClose} className="explorer-close-btn" aria-label="Cerrar explorador">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="explorer-body">
        {loading && (
          <div className="explorer-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="explorer-skeleton-row">
                <div className="explorer-skeleton-cell wide" />
                <div className="explorer-skeleton-cell medium" />
                <div className="explorer-skeleton-cell narrow" />
                <div className="explorer-skeleton-cell medium" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="empty-state-wrapper">
            <div className="empty-state-icon" style={{ backgroundColor: 'rgba(255,0,0,0.1)', color: '#ef4444' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="empty-state-title">No se pudo cargar la data</h3>
            <p className="empty-state-text">{error}</p>
            {tableName && (
              <button className="clear-search-btn" onClick={fetchData} style={{ marginTop: '1rem' }}>
                Reintentar
              </button>
            )}
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="empty-state-wrapper">
            <h3 className="empty-state-title">Tabla Vacía</h3>
            <p className="empty-state-text">La tabla existe pero no devolvió registros.</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <table className="explorer-table" role="table" aria-label={`Datos de ${resourceName}`}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, r_idx) => (
                <tr key={r_idx}>
                  {columns.map((col, c_idx) => (
                    <td key={c_idx} title={row[col]?.toString()}>
                      {row[col] !== null && row[col] !== undefined
                        ? row[col].toString()
                        : <span style={{ opacity: 0.3 }}>NULL</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* M7: Footer con aria-live para paginación */}
      {meta && (
        <div className="explorer-footer">
          {/* M7: aria-live para anunciar cambios de página */}
          <span
            aria-live="polite"
            aria-atomic="true"
            style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
          >
            Página <b style={{ color: 'var(--text-primary)' }}>{meta.page}</b> de{' '}
            <b style={{ color: 'var(--text-primary)' }}>{meta.totalPages}</b>{' '}
            &mdash; {meta.total.toLocaleString('es-AR')} registros
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="explorer-page-size-select"
              aria-label="Filas por página"
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <option key={n} value={n}>{n} filas</option>
              ))}
            </select>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="explorer-pagination-btn"
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              className="explorer-pagination-btn primary"
              aria-label="Página siguiente"
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
