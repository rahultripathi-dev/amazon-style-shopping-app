import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuToggle: () => void;
}

const Header = React.memo(function Header({ searchQuery, onSearchChange, onMenuToggle }: Props) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <button className={styles.menuBtn} onClick={onMenuToggle}>☰</button>
        <span className={styles.logo} onClick={() => navigate('/')}>🛒 ShopLite</span>
      </div>

      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.icons}>
        <span className={styles.iconBtn}>🛒</span>
        <span className={styles.iconBtn}>👤</span>
      </div>
    </header>
  );
});

export default Header;
