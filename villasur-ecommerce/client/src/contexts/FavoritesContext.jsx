import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // array de productos favoritos
  const [loading, setLoading] = useState(false);

  // Helpers para localStorage
  const LS_KEY = 'villasur_favorites';
  const getLocalFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  };
  const setLocalFavorites = favs => {
    localStorage.setItem(LS_KEY, JSON.stringify(favs));
  };

  // Cargar favoritos al iniciar
  useEffect(() => {
    setLoading(true);
    if (user) {
      axios.get('/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      })
        .then(res => setFavorites(res.data))
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false));
    } else {
      setFavorites(getLocalFavorites());
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [user]);

  // Agregar a favoritos
  const addFavorite = async product => {
    if (user) {
      await axios.post('/api/favorites', { product_id: product.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      });
      // Refrescar favoritos
      const res = await axios.get('/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      });
      setFavorites(res.data);
    } else {
      const favs = getLocalFavorites();
      if (!favs.find(f => f.id === product.id)) {
        const newFavs = [...favs, product];
        setLocalFavorites(newFavs);
        setFavorites(newFavs);
      }
    }
  };

  // Quitar de favoritos
  const removeFavorite = async productId => {
    if (user) {
      await axios.delete(`/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      });
      // Refrescar favoritos
      const res = await axios.get('/api/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      });
      setFavorites(res.data);
    } else {
      const favs = getLocalFavorites().filter(f => f.id !== productId);
      setLocalFavorites(favs);
      setFavorites(favs);
    }
  };

  // Saber si un producto está en favoritos
  const isFavorite = productId => favorites.some(f => f.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
} 