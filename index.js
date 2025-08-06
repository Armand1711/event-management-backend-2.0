const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const pool = require('./db');

dotenv.config();

const app = express();
<<<<<<< HEAD
app.use(express.json());

=======

// CORS configuration for frontend
const corsOptions = {
    origin: 'http://localhost:3000', // Update with deployed frontend URL later
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

>>>>>>> c684aacae2337a5890c3ff31076c2474758f36fe
// Database initialization
const initializeDatabase = async () => {
    let client;
    try {
<<<<<<< HEAD
        const client = await pool.connect();
        const sql = fs.readFileSync('./init.sql', 'utf8');
        await client.query(sql);
        client.release();
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization error:', err.stack);
=======
        client = await pool.connect();
        let sql;
        try {
            sql = fs.readFileSync('./init.sql', 'utf8');
        } catch (fileErr) {
            console.error('Could not read init.sql:', fileErr.message);
            return;
        }
        // Split SQL into individual statements and execute them to handle complex scripts
        const statements = sql.split(';').filter(s => s.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await client.query(statement);
                } catch (queryErr) {
                    console.error('Failed SQL:', statement);
                    console.error('Error:', queryErr.message);
                }
            }
        }
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database initialization error:', err.stack);
        // Continue even if some inserts fail (e.g., ON CONFLICT)
    } finally {
        if (client) client.release();
>>>>>>> c684aacae2337a5890c3ff31076c2474758f36fe
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

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

module.exports = { app };