const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/signup', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *',
            [email, name, hashedPassword]
        );
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        console.error('Signup error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;