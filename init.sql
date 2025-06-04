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
=======
    name VARCHAR(255) NOT NULL, -- Added for employee assignment
    password VARCHAR(255) NOT NULL
);

-- Events table table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- UNIQUE to prevent conflicts

    client VARCHAR(255),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    total_tasks INTEGER NOT NULL DEFAULT 0,
    budget DECIMAL(10,2) DEFAULT 0.00,
    spent DECIMAL(10,2) DEFAULT 0.00
);

-- Budget items table
CREATE TABLE IF NOT EXISTS budget_items (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL
);


-- Tasks table

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    assigned_to INTEGER REFERENCES users(id),

    dueDate DATE,
    budget DECIMAL(10,2),
    completed BOOLEAN DEFAULT FALSE
);

-- Event requests table
CREATE TABLE IF NOT EXISTS event_requests (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL UNIQUE,

    budget DECIMAL(10,2) NOT NULL,
    client VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    tasks INTEGER NOT NULL,
    CONSTRAINT fk_event_requests_events FOREIGN KEY (name) REFERENCES events(name) ON DELETE CASCADE
);

-- Archive table
CREATE TABLE IF NOT EXISTS archive (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date_completed DATE NOT NULL,
    completed_tasks VARCHAR(50) NOT NULL,
    total_budget DECIMAL(10,2) NOT NULL,
    notes TEXT
);

-- Initial data
INSERT INTO users (email, name, password) VALUES
('admin@example.com', 'Admin User', '$2b$10$examplehashedpassword123'),
('john.doe@example.com', 'John Doe', '$2b$10$examplehashedpassword123'),
('lisa.smith@example.com', 'Lisa Smith', '$2b$10$examplehashedpassword123'),
('michael.johnson@example.com', 'Michael Johnson', '$2b$10$examplehashedpassword123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (name, client, date, status, progress, completed_tasks, total_tasks, budget, spent) VALUES
('Corporate Year-End Gala', 'ABC Consulting', '2025-12-15', 'In Progress', 50, 5, 10, 500000.00, 280000.00),
('Wedding Reception', 'Emily & Daniel', '2025-06-05', 'In Progress', 17, 2, 12, 180000.00, 30000.00),
('Tech Product Launch', 'InnovateX', '2025-08-22', 'In Progress', 85, 6, 7, 300000.00, 250000.00)
ON CONFLICT (name) DO NOTHING;

INSERT INTO budget_items (event_id, description, category, amount, status) VALUES
(1, 'Venue Rental', 'Venue', 1500.00, 'Approved'),
(1, 'Catering Services', 'Food', 800.00, 'Pending'),
(2, 'Decorations', 'Setup', 300.00, 'Approved'),
(3, 'Entertainment', 'Entertainment', 500.00, 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (event_id, title, priority, assigned_to, dueDate, budget, completed) VALUES
(1, 'Book Venue', 'High', 2, '2025-01-01', 120000.00, FALSE),
(1, 'Caterer Selection', 'Medium', 3, '2025-01-21', 80000.00, FALSE),
(1, 'Guest List Management', 'High', 4, '2025-01-01', 15000.00, FALSE),
(1, 'Photography & Videography', 'Medium', 3, '2025-01-01', 40000.00, FALSE),
(1, 'Event Promotion & Invitations', 'Low', 2, '2025-01-01', 25000.00, FALSE),
(1, 'Event Branding & Design', 'Low', 4, '2025-01-01', 30000.00, TRUE),
(1, 'Entertainment & Music', 'High', NULL, '2025-01-01', 50000.00, TRUE),
(1, 'Seating Arrangement & Decor', 'Medium', NULL, '2025-01-01', 20000.00, TRUE),
(1, 'Technical Setup', 'High', NULL, '2025-01-01', 35000.00, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO event_requests (name, budget, client, date, tasks) VALUES
('Workshop on Sustainable Design', 40000.00, 'Green Innovations Ltd.', '2025-05-15', 8),
('Networking Gala', 110000.00, 'Prestige Networking Group', '2025-06-20', 10),
('Charity Fundraising Dinner', 120000.00, 'Hope for All Foundation', '2025-07-25', 12)
ON CONFLICT (name) DO NOTHING;

INSERT INTO archive (event_name, status, date_completed, completed_tasks, total_budget, notes) VALUES
('Wedding Reception – Sam & Alex', 'Completed', '2025-02-12', '14/14', 180000.00, 'Seamless coordination. Venue staff was excellent.'),
('Corporate Gala – Q4 Summit', 'Completed', '2025-03-05', '20/20', 250000.00, 'All sponsors happy. AV setup was flawless.'),
('Charity Auction – Hope Foundation', 'Completed', '2025-01-28', '10/10', 75000.00, 'Great turnout. Raised more than expected.')
ON CONFLICT DO NOTHING;