import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

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
        <button className="vs-header__icon" onClick={() => navigate('/login')} aria-label="Usuario">
          <FaUser size={22} />
        </button>
        <button className="vs-header__icon" onClick={() => navigate('/carrito')} aria-label="Carrito">
          <FaShoppingCart size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header; 