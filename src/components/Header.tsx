import React from 'react';
import { useNavigate } from 'react-router-dom';


interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuToggle: () => void;
}

export default function Header({ searchQuery, onSearchChange, onMenuToggle }: Props) {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#131921',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <button
    onClick={onMenuToggle}
    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
  >
    ☰
  </button>
  <span
    onClick={() => navigate('/')}
    style={{ color: '#fff', fontWeight: 700, fontSize: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}
  >
    🛒 ShopLite
  </span>
</div>

      <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '20px' }}>
        <span style={{ cursor: 'pointer' }}>🛒</span>
        <span style={{ cursor: 'pointer' }}>👤</span>
      </div>
    </header>
  );
}
