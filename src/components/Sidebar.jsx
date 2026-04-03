import React from 'react';

function Sidebar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <aside className="sidebar" style={{ width: '300px', padding: '1.5rem', borderRight: '1px solid var(--border-color, rgba(255,255,255,0.05))' }}>
      <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate-500)', marginBottom: '1rem' }}>Taxonomía</h3>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <li>
          <button 
            className={`sidebar-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            <span>📊 Resumen Global</span>
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.category}>
            <button 
              className={`sidebar-item ${selectedCategory === cat.category ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.category)}
            >
              <span style={{flex: 1, textAlign: 'left'}}>{cat.category}</span>
              <span className="badge">{cat.datasets.length}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
