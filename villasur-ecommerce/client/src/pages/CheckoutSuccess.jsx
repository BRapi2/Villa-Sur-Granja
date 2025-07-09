import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Orders.module.css';

// yape pe pe pe
const YAPE_QR_URL = '/yape-qr.png'; 
const YAPE_PHONE = '994 128 083'; 

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Obtener order_id de la query string
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError('No se encontró la orden.');
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`/api/orders/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('villasur_token')}` }
    })
      .then(res => {
        const found = res.data.find(o => o.id === parseInt(orderId));
        if (found) setOrder(found);
        else setError('No se encontró la orden.');
      })
      .catch(() => setError('Error al obtener la orden.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setUploadMsg('');
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return setUploadMsg('Selecciona un archivo.');
    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('comprobante', file);
    formData.append('order_id', orderId);
    try {
      await axios.post('/api/orders/comprobante', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('villasur_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadMsg('¡Comprobante subido correctamente!');
    } catch (err) {
      setUploadMsg('Error al subir el comprobante.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.orders}><p>Cargando orden...</p></div>;
  if (error) return <div className={styles.orders}><p style={{color:'red'}}>{error}</p></div>;

  return (
    <div className={styles.orders}>
      <h2>¡Compra realizada con éxito!</h2>
      <p>Tu número de orden es <b>#{order.id}</b></p>
      <h3>Resumen de la orden</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.product_id}>
            <img src={item.image_url} alt={item.name} style={{width:60}} />
            {item.name} x{item.quantity} - S/. {item.price}
          </li>
        ))}
      </ul>
      <p><b>Total:</b> S/. {order.total}</p>
      <hr />
      <h3>Paga con Yape</h3>
      <p>Escanea el QR o paga al número <b>{YAPE_PHONE}</b> y sube el comprobante de pago.</p>
      <img src={YAPE_QR_URL} alt="QR de Yape" style={{width:180, margin:'1rem 0'}} />
      <form onSubmit={handleUpload} style={{marginTop:'1rem'}}>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <button type="submit" disabled={uploading}>{uploading ? 'Subiendo...' : 'Subir comprobante'}</button>
      </form>
      {uploadMsg && <p>{uploadMsg}</p>}
      <button onClick={() => navigate('/productos')} style={{marginTop:'2rem'}}>Volver al catálogo</button>
    </div>
  );
} 