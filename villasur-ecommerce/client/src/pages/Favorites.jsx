import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import styles from './Catalog.module.css';

export default function Favorites() {
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className={styles.catalog}>
      <h2>Mis Favoritos</h2>
      {favorites.length === 0 ? (
        <p>No tienes productos favoritos.</p>
      ) : (
        <div className={styles.grid}>
          {favorites.map(product => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={product.image_url} alt={product.name} />
                <button
                  className={styles.favBtn}
                  onClick={() => removeFavorite(product.id)}
                  aria-label="Quitar de favoritos"
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
      )}
    </div>
  );
} 