import React from 'react';

function Sidebar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Taxonomía</h3>
      
      <ul className="sidebar-list">
        <li>
          <button 
            className={`sidebar-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            <span className="sidebar-item-text">📊 Resumen Global</span>
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.category}>
            <button 
              className={`sidebar-item ${selectedCategory === cat.category ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.category)}
            >
              <span className="sidebar-item-text">{cat.category}</span>
              <span className="badge">{cat.datasets.length}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
