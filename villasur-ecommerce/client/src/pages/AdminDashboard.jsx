import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const initialForm = {
  name: '',
  description: '',
  price: '',
  weight: '',
  origin: '',
  image_url: '',
  stock: '',
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem('villasur_token');

  const fetchProducts = () => {
    axios.get('/api/products').then(res => setProducts(res.data));
  };

  // Fetch orders for admin
  const fetchOrders = () => {
    axios.get('/api/orders/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = product => {
    setEditingId(product.id);
    setForm({ ...product });
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Product updated successfully');
      } else {
        await axios.post('/api/products', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Product created successfully');
      }
      fetchProducts();
      handleCancel();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Product deleted successfully');
      fetchProducts();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.admin}>
      <h2>Admin Dashboard</h2>
      <div className={styles.flex}>
        <div className={styles.formSection}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            <div className={styles.row}>
              <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} />
            </div>
            <div className={styles.row}>
              <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} />
              <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
            </div>
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            <div className={styles.actions}>
              <button type="submit" disabled={loading}>{loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
              {editingId && <button type="button" className={styles.cancel} onClick={handleCancel}>Cancel</button>}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
          </form>
        </div>
        <div className={styles.tableSection}>
          <h3>Product List</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className={editingId === product.id ? styles.editing : ''}>
                    <td><img src={product.image_url} alt={product.name} className={styles.thumb} /></td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button className={styles.edit} onClick={() => handleEdit(product)}>Edit</button>
                      <button className={styles.delete} onClick={() => setConfirmDelete(product.id)}>Delete</button>
                      {confirmDelete === product.id && (
                        <div className={styles.confirmBox}>
                          <span>Are you sure?</span>
                          <button onClick={() => handleDelete(product.id)} disabled={loading}>Yes</button>
                          <button onClick={() => setConfirmDelete(null)}>No</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.tableSection}>
          <h3>Order List</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_email || order.user_id}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>S/. {order.total}</td>
                    <td>
                      {order.comprobante ? (
                        <a href={`/uploads/comprobantes/${order.comprobante}`} target="_blank" rel="noopener noreferrer">Ver</a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 