-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    total DECIMAL(10, 2) NOT NULL
);

-- OrderItems table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, weight, origin, image_url, stock) VALUES
('Beef Ribeye', 'Premium beef ribeye steak.', 25.99, '500g', 'Argentina', 'https://example.com/ribeye.jpg', 20),
('Pork Loin', 'Juicy pork loin, perfect for roasting.', 15.50, '1kg', 'Spain', 'https://example.com/porkloin.jpg', 30),
('Chicken Breast', 'Boneless chicken breast.', 8.99, '400g', 'Brazil', 'https://example.com/chickenbreast.jpg', 50),
('Lamb Chops', 'Tender lamb chops for grilling.', 22.00, '600g', 'New Zealand', 'https://example.com/lambchops.jpg', 15),
('Sausage Mix', 'Assorted gourmet sausages.', 12.75, '700g', 'Germany', 'https://example.com/sausagemix.jpg', 40);

-- Insert admin user (password: admin123, hash generated with bcrypt)
INSERT INTO users (email, password_hash, role) VALUES (
    'admin@villasur.com',
    '$2b$10$N9qo8uLOickgx2ZMRZo5i.ez2p1uQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1G',
    'admin'
) ON CONFLICT (email) DO NOTHING; 