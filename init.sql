-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

--  events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client VARCHAR(255),
    date DATE,
    status VARCHAR(50),
    progress INTEGER,
    completed INTEGER,
    total INTEGER,
    colorClass VARCHAR(50)
);

-- budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(50),
    priorityClass VARCHAR(50),
    assignedTo VARCHAR(255),
    dueDate DATE,
    status VARCHAR(50),
    budget DECIMAL(10,2),
    completed BOOLEAN DEFAULT FALSE
);

-- event_requests table
CREATE TABLE IF NOT EXISTS event_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2),
    client VARCHAR(255),
    date DATE,
    tasks INTEGER
);

-- Initial data
INSERT INTO events (name, client, date, status, progress, completed, total, colorClass) VALUES
('Corporate Year-End Gala', 'ABC Consulting', '2025-12-15', 'In Progress', 50, 5, 10, 'yellow'),
('Wedding Reception', 'Emily & Daniel', '2025-06-05', 'In Progress', 17, 2, 12, 'red'),
('Tech Product Launch', 'InnovateX', '2025-08-22', 'In Progress', 85, 6, 7, 'green')
ON CONFLICT DO NOTHING;

INSERT INTO budget_items (event_id, description, category, amount, status) VALUES
(1, 'Venue Rental', 'Venue', 1500.00, 'Approved'),
(1, 'Catering Services', 'Food', 800.00, 'Pending'),
(2, 'Decorations', 'Setup', 300.00, 'Approved'),
(3, 'Entertainment', 'Entertainment', 500.00, 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (event_id, title, priority, priorityClass, assignedTo, dueDate, status, budget, completed) VALUES
(1, 'Book Venue', 'High', 'red', 'John Doe', '2025-01-01', 'In Progress', 120000, FALSE),
(1, 'Caterer Selection', 'Medium', 'yellow', 'Lisa Smith', '2025-01-21', 'In Progress', 80000, FALSE),
(1, 'Guest List Management', 'High', 'red', 'Michael Johnson', '2025-01-01', 'In Progress', 15000, FALSE),
(1, 'Photography & Videography', 'Medium', 'yellow', 'Lisa Smith', '2025-01-01', 'In Progress', 40000, FALSE),
(1, 'Event Promotion & Invitations', 'Low', 'green', 'John Doe', '2025-01-01', 'In Progress', 25000, FALSE),
(1, 'Event Branding & Design', 'Low', 'green', 'Michael Johnson', '2025-01-01', 'In Progress', 30000, TRUE),
(1, 'Entertainment & Music', 'High', 'red', 'N/A', '2025-01-01', 'In Progress', 50000, TRUE),
(1, 'Seating Arrangement & Decor', 'Medium', 'yellow', 'N/A', '2025-01-01', 'In Progress', 20000, TRUE),
(1, 'Technical Setup', 'High', 'red', 'N/A', '2025-01-01', 'In Progress', 35000, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO event_requests (name, budget, client, date, tasks) VALUES
('Workshop on Sustainable Design', 40000, 'Green Innovations Ltd.', '2025-05-15', 8),
('Networking Gala', 110000, 'Prestige Networking Group', '2025-06-20', 10),
('Charity Fundraising Dinner', 120000, 'Hope for All Foundation', '2025-07-25', 12)
ON CONFLICT DO NOTHING;