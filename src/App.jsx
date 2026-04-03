import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import './App.css';
import taxonomiaData from './data/taxonomia_data.json';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardSummary from './components/DashboardSummary';
import DatasetCard from './components/DatasetCard';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');

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
      
      return {
        ...cat,
        datasets: filteredDatasets
      };
    }).filter(cat => cat.datasets.length > 0);
    
  }, [searchQuery]);

  // Which category datasets to show
  const activeCategoryData = selectedCategory 
    ? filteredData.find(cat => cat.category === selectedCategory) 
    : null;

  return (
    <div className="layout-container">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <div className="main-layout">
        <Sidebar 
          categories={filteredData} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <main className="content-area">
          {!selectedCategory ? (
            <DashboardSummary data={filteredData} />
          ) : (
            <div className="category-view fade-in">
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {activeCategoryData ? activeCategoryData.category : 'Categoría no encontrada'}
              </h2>
              
              {activeCategoryData && activeCategoryData.datasets.length > 0 ? (
                <div className="cards-grid">
                  {activeCategoryData.datasets.map(ds => (
                    <DatasetCard key={ds.key} dataset={ds} />
                  ))}
                </div>
              ) : (
                <p className="empty-state">No se encontraron resultados para la búsqueda actual.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
