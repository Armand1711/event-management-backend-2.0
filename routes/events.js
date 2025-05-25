const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (err) {
        console.error('Events error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;