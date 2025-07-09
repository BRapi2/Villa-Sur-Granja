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
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <p>Por favor inicia sesión para ver tus pedidos.</p>;
  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.orders}>
      <h2>Historial de Pedidos</h2>
      {orders.length === 0 ? <p>No tienes pedidos aún.</p> : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className={styles.order}>
              <div>
                <strong>Orden #{order.id}</strong> - {new Date(order.created_at).toLocaleString()}<br />
                <b>Total:</b> S/. {order.total}
              </div>
              <ul className={styles.items}>
                {order.items.map(item => (
                  <li key={item.product_id}>
                    <img src={item.image_url} alt={item.name} style={{width:50}} />
                    {item.name} x{item.quantity} - S/. {item.price}
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