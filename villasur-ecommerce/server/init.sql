-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weight VARCHAR(100),
    origin VARCHAR(255),
    image_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    total DECIMAL(10, 2) NOT NULL
);

-- OrderItems table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, weight, origin, image_url, stock) VALUES
('Pollo entero', 'Pollo entero fresco, ideal para asar o cocinar al horno.', 10.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', 20),
('Pechuga de pollo', 'Pechuga de pollo fresca, sin hueso ni piel.', 22.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', 30),
('Muslo de pollo', 'Muslo de pollo jugoso, perfecto para guisos.', 18.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', 25),
('Pierna de pollo', 'Pierna de pollo fresca, ideal para hornear.', 18.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', 25),
('Huevo', 'Huevos frescos de corral, ricos en proteínas.', 15.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', 50),
('Queso fresco', 'Queso fresco artesanal, suave y delicioso.', 20.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', 15),
('Churrasco', 'Churrasco de res, corte jugoso para la parrilla.', 40.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', 20),
('Bistek', 'Bistek de res, tierno y sabroso.', 35.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', 20),
('Lomo fino', 'Lomo fino de res, el corte más suave y premium.', 140.00, '1kg', 'Granja local', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', 10);

-- Insert admin user (password: admin123, hash generado con bcrypt)
INSERT INTO users (email, password_hash, role) VALUES (
    'admin@villasur.com',
    '$2b$10$N9qo8uLOickgx2ZMRZo5i.ez2p1uQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1G',
    'admin'
); 