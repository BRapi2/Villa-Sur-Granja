import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.catalog}>
      <h2>Product Catalog</h2>
      {loading && <p>Cargando productos...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className={styles.grid}>
        {!loading && !error && products.map(product => (
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