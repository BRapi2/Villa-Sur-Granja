import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className={styles.catalog}>
      <h2>Product Catalog</h2>
      <div className={styles.grid}>
        {products.map(product => (
          <div key={product.id} className={styles.card}>
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className={styles.info}>
              <span>${product.price}</span>
              <span>{product.weight}</span>
            </div>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
} 