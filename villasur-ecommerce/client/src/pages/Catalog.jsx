import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

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
            <div style={{position:'relative'}}>
              <img src={product.image_url} alt={product.name} />
              <button
                className={styles.favBtn}
                onClick={() => isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product)}
                aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                style={{position:'absolute',top:8,right:8,background:'none',border:'none',cursor:'pointer',fontSize:'1.5rem'}}
              >
                {isFavorite(product.id) ? '❤️' : '🤍'}
              </button>
            </div>
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