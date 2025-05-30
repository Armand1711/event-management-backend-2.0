const express = require('express');
const cors = require('cors');
const fs = require('fs');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const pool = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database schema and data
const initializeDatabase = async () => {
    try {
        const client = await pool.connect();
        const sql = fs.readFileSync('./init.sql', 'utf8');
        await client.query(sql);
        client.release();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization error:', err.stack);
    }
};

pool.connect((err) => {
    if (err) console.error('Database connection error:', err.stack);
    else {
        console.log('Connected to Aiven PostgreSQL');
        initializeDatabase();
    }
});

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const budgetRoutes = require('./routes/budget');
const tasksRoutes = require('./routes/tasks');
const eventRequestsRoutes = require('./routes/eventRequests');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/event-requests', eventRequestsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

module.exports = { app };