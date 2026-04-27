import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuToggle: () => void;
}

const Header = React.memo(function Header({ searchQuery, onSearchChange, onMenuToggle }: Props) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-[100] bg-[#131921] px-6 py-[10px] flex items-center gap-4">
      <div className="flex items-center gap-3">
        <button className="bg-transparent border-0 text-white text-xl cursor-pointer p-1" onClick={onMenuToggle}>☰</button>
        <span className="text-white font-bold text-xl cursor-pointer whitespace-nowrap" onClick={() => navigate('/')}>🛒 ShopLite</span>
      </div>

      <div className="flex-1 max-w-[600px] mx-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full px-[14px] py-2 rounded-md border-0 text-sm outline-none bg-white"
        />
      </div>

      <div className="flex gap-4 text-white text-xl">
        <span className="cursor-pointer">🛒</span>
        <span className="cursor-pointer">👤</span>
      </div>
    </header>
  );
});

export default Header;
