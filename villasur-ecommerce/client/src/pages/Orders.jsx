import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styles from './Orders.module.css';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get('/api/orders/history', {
      headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
    })
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <p>Please log in to view your orders.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.orders}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className={styles.order}>
              <div>
                <strong>Order #{order.id}</strong> - {new Date(order.created_at).toLocaleString()}<br />
                Total: ${order.total}
              </div>
              <ul className={styles.items}>
                {order.items.map(item => (
                  <li key={item.id}>
                    <img src={item.image_url} alt={item.name} />
                    {item.name} x{item.quantity} - ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 