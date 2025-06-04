-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    client VARCHAR(255),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    total_tasks INTEGER NOT NULL DEFAULT 0,
    budget DECIMAL(10,2) DEFAULT 0.00,
    spent DECIMAL(10,2) DEFAULT 0.00
);

-- Initial data
INSERT INTO users (email, name, password) VALUES
('admin@example.com', 'Admin User', '$2b$10$examplehashedpassword123')
ON CONFLICT (email) DO NOTHING;