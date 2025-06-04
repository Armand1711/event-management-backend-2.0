const express = require('express');
  const pool = require('../db');

  const router = express.Router();

  router.get('/', async (req, res) => {
      try {
          const result = await pool.query('SELECT * FROM event_requests');
          res.json(result.rows);
      } catch (err) {
          console.error('Error fetching event requests:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.post('/', async (req, res) => {
      const { name, budget, client, date, tasks } = req.body;
      try {
          const result = await pool.query(
              'INSERT INTO event_requests (name, budget, client, date, tasks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
              [name, budget, client, date, tasks]
          );
          res.status(201).json(result.rows[0]);
      } catch (err) {
          console.error('Error adding event request:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.delete('/:id', async (req, res) => {
      const { id } = req.params;
      try {
          const result = await pool.query('DELETE FROM event_requests WHERE id = $1 RETURNING *', [id]);
          if (result.rows.length === 0) return res.status(404).json({ error: 'Event request not found' });
          res.json({ message: 'Event request deleted' });
      } catch (err) {
          console.error('Error deleting event request:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  module.exports = router;