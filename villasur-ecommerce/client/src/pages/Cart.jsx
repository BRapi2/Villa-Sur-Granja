import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/orders', {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty.</p> : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id} className={styles.item}>
                <img src={item.image_url} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.summary}>
            <span>Total: ${total.toFixed(2)}</span>
            <button onClick={handleCheckout} disabled={loading}>{loading ? 'Processing...' : 'Checkout'}</button>
            <button onClick={clearCart} className={styles.clear}>Clear Cart</button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </>
      )}
    </div>
  );
} 