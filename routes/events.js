const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { name, client, date, status, progress, completed_tasks, total_tasks, budget, spent } = req.body;
        const result = await pool.query(
            'INSERT INTO events (name, client, date, status, progress, completed_tasks, total_tasks, budget, spent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, client, date, status, progress, completed_tasks, total_tasks, budget, spent]
        );
        res.status(201).json({ message: 'Event created', event: result.rows[0] });
    } catch (err) {
        console.error('Event creation error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;