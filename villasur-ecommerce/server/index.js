import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import favoritesRoutes from './routes/favorites.js';
import path from 'path';

// Config env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/uploads/comprobantes', express.static(path.join(process.cwd(), 'uploads/comprobantes')));

app.get('/', (req, res) => {
  res.send('VillaSur API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 