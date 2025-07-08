import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>Welcome to VillaSur</h1>
      <p>Your online butcher shop for premium meats.</p>
      <div className={styles.links}>
        <Link to="/catalog">View Products</Link>
        <Link to="/cart">Go to Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
} 