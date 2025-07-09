import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="vs-header">
      <div className="vs-header__left">
        <button className="vs-header__icon" onClick={() => setShowMenu(!showMenu)} aria-label="Menú">
          <FaBars size={24} />
        </button>
        {showMenu && (
          <nav className="vs-header__menu">
            <Link to="/" onClick={() => setShowMenu(false)}>Inicio</Link>
            <Link to="/productos" onClick={() => setShowMenu(false)}>Productos</Link>
            <Link to="/carrito" onClick={() => setShowMenu(false)}>Carrito</Link>
            <Link to="/favorites" onClick={() => setShowMenu(false)}>Favoritos</Link>
            <Link to="/login" onClick={() => setShowMenu(false)}>Acceso</Link>
          </nav>
        )}
      </div>
      <div className="vs-header__center">
        <Link to="/" className="vs-header__logo-group">
          <img src={logo} alt="Villa Sur Logo" className="vs-header__logo" />
          <span className="vs-header__brand">Villa Sur</span>
        </Link>
      </div>
      <div className="vs-header__right">
        <button className="vs-header__icon" onClick={() => setShowSearch(!showSearch)} aria-label="Buscar">
          <FaSearch size={22} />
        </button>
        <button className="vs-header__icon" onClick={() => navigate('/login')} aria-label="Usuario">
          <FaUser size={22} />
        </button>
        <button className="vs-header__icon" onClick={() => navigate('/favorites')} aria-label="Favoritos">
          <FaHeart size={22} />
        </button>
        <button className="vs-header__icon" onClick={() => navigate('/carrito')} aria-label="Carrito">
          <FaShoppingCart size={22} />
        </button>
      </div>
      {showSearch && (
        <form className="vs-header__search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button type="submit">Buscar</button>
        </form>
      )}
    </header>
  );
};

export default Header; 