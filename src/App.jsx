import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import './App.css';
import taxonomiaData from './data/taxonomia_data.json';
import { useUrlState } from './hooks/useUrlState';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardSummary from './components/DashboardSummary';
import DatasetCard from './components/DatasetCard';

function App() {
  const { category: selectedCategory, query: searchQuery, setCategory: setSelectedCategory, setQuery: setSearchQuery } = useUrlState();

  const [theme, setTheme] = useState('dark');
  const [expandedDatasetKey, setExpandedDatasetKey] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // M2: filtros y orden
  const [sortBy, setSortBy] = useState('default');       // 'default' | 'nombre' | 'org'
  const [filterType, setFilterType] = useState('all');   // 'all' | 'pba' | 'abiertos'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Filter datasets based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return taxonomiaData;

    const query = searchQuery.toLowerCase();

    return taxonomiaData.map(cat => {
      const filteredDatasets = cat.datasets.filter(ds => {
        const titleMatch = ds.title.toLowerCase().includes(query);
        const orgMatch = ds.org?.toLowerCase().includes(query);
        const descMatch = ds.desc?.toLowerCase().includes(query);
        const resMatch = ds.resources?.some(r => r.toLowerCase().includes(query));
        return titleMatch || orgMatch || descMatch || resMatch;
      });

      return { ...cat, datasets: filteredDatasets };
    }).filter(cat => cat.datasets.length > 0);

  }, [searchQuery]);

  const activeCategoryData = selectedCategory
    ? filteredData.find(cat => cat.category === selectedCategory)
    : null;

  // M2: datasets con filtro de tipo y orden aplicados
  const displayedDatasets = useMemo(() => {
    if (!activeCategoryData) return [];
    let ds = [...activeCategoryData.datasets];
    if (filterType !== 'all') ds = ds.filter(d => d.type === filterType);
    if (sortBy === 'nombre') ds.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    if (sortBy === 'org') ds.sort((a, b) => (a.org || '').localeCompare(b.org || '', 'es'));
    return ds;
  }, [activeCategoryData, sortBy, filterType]);

  // Reset al cambiar de categoría/búsqueda
  useEffect(() => {
    setExpandedDatasetKey(null);
    setSortBy('default');
    setFilterType('all');
  }, [searchQuery, selectedCategory]);

  // M6: total de resultados en búsqueda global
  const totalSearchResults = useMemo(() =>
    filteredData.reduce((acc, c) => acc + c.datasets.length, 0),
    [filteredData]
  );

  return (
    <div className="layout-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen(o => !o)}
      />

      {/* M6: banner de resultados de búsqueda */}
      {searchQuery && filteredData.length > 0 && (
        <div className="search-results-banner">
          <span>
            <b>{totalSearchResults}</b> resultado{totalSearchResults !== 1 ? 's' : ''} en{' '}
            <b>{filteredData.length}</b> categoría{filteredData.length !== 1 ? 's' : ''} para &ldquo;{searchQuery}&rdquo;
          </span>
        </div>
      )}

      <div className="main-layout">
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}
        <Sidebar
          categories={filteredData}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
          isOpen={isSidebarOpen}
        />

        <main className="content-area">
          {filteredData.length === 0 ? (
            /* M5: key para animar transición */
            <div key="empty" className="empty-state-wrapper fade-in">
              <div className="empty-icon">🔍</div>
              <h3>No hay resultados</h3>
              <p>No se encontraron datos que coincidan con &ldquo;<span style={{ fontStyle: 'italic' }}>{searchQuery}</span>&rdquo;</p>
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Limpiar búsqueda
              </button>
            </div>
          ) : !selectedCategory ? (
            /* M5: key para animar entrada del resumen */
            <div key="summary" className="fade-in">
              {/* M4: pasa onSelectCategory para que el gráfico sea clickeable */}
              <DashboardSummary data={filteredData} onSelectCategory={setSelectedCategory} />
            </div>
          ) : (
            /* M5: key cambia con la categoría → re-mount → dispara fade-in */
            <div key={selectedCategory} className="category-view fade-in">
              <div className="category-header">
                <div>
                  <h2 className="category-title">
                    {activeCategoryData ? activeCategoryData.category : 'Categoría no encontrada'}
                  </h2>
                  {/* M6: contador de resultados */}
                  {activeCategoryData && (
                    <p className="results-count">
                      {displayedDatasets.length !== activeCategoryData.datasets.length
                        ? `${displayedDatasets.length} de ${activeCategoryData.datasets.length} datasets`
                        : `${activeCategoryData.datasets.length} dataset${activeCategoryData.datasets.length !== 1 ? 's' : ''}`
                      }
                    </p>
                  )}
                </div>

                {/* M2: toolbar de filtros */}
                {activeCategoryData && activeCategoryData.datasets.length > 1 && (
                  <div className="dataset-toolbar">
                    <select
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                      className="toolbar-select"
                      aria-label="Filtrar por tipo"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="pba">Portal PBA</option>
                      <option value="abiertos">Nacional</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="toolbar-select"
                      aria-label="Ordenar por"
                    >
                      <option value="default">Orden original</option>
                      <option value="nombre">A–Z por nombre</option>
                      <option value="org">A–Z por organismo</option>
                    </select>
                  </div>
                )}
              </div>

              {activeCategoryData && displayedDatasets.length > 0 ? (
                <div className="cards-grid">
                  {displayedDatasets.map(ds => (
                    <DatasetCard
                      key={ds.key}
                      dataset={ds}
                      isExpanded={expandedDatasetKey === ds.key}
                      onToggleExpand={() => setExpandedDatasetKey(prev => prev === ds.key ? null : ds.key)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state-wrapper fade-in">
                  <div className="empty-icon">📂</div>
                  <h3>Sin resultados</h3>
                  <p>
                    {filterType !== 'all'
                      ? 'No hay datasets del tipo seleccionado en esta categoría.'
                      : 'No se encontraron datos para los filtros actuales.'}
                  </p>
                  <button className="clear-search-btn" onClick={() => { setFilterType('all'); setSearchQuery(''); }}>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
