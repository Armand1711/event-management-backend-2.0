const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM budget_items');
        res.json(result.rows);
    } catch (err) {
        console.error('Budget error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    const { event_id, description, category, amount, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO budget_items (event_id, description, category, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [event_id, description, category, amount, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Budget create error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { event_id, description, category, amount, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE budget_items SET event_id = $1, description = $2, category = $3, amount = $4, status = $5 WHERE id = $6 RETURNING *',
            [event_id, description, category, amount, status, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Budget item not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Budget update error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM budget_items WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Budget item not found' });
        res.json({ message: 'Budget item deleted' });
    } catch (err) {
        console.error('Budget delete error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;