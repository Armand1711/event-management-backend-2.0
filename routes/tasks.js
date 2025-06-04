const express = require('express');
  const pool = require('../db');

  const router = express.Router();

  router.get('/', async (req, res) => {
      try {
          const result = await pool.query('SELECT * FROM tasks');
          res.json(result.rows);
      } catch (err) {
          console.error('Error fetching tasks:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.post('/', async (req, res) => {
      const { event_id, title, priority, assigned_to, budget, completed } = req.body;
      try {
          const result = await pool.query(
              'INSERT INTO tasks (event_id, title, priority, assigned_to, budget, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
              [event_id, title, priority, assigned_to, budget, completed]
          );
          res.status(201).json(result.rows[0]);
      } catch (err) {
          console.error('Error adding task:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.put('/:id', async (req, res) => {
      const { id } = req.params;
      const { event_id, title, priority, assigned_to, budget, completed } = req.body;
      try {
          const result = await pool.query(
              'UPDATE tasks SET event_id = $1, title = $2, priority = $3, assigned_to = $4, budget = $5, completed = $6 WHERE id = $7 RETURNING *',
              [event_id, title, priority, assigned_to, budget, completed, id]
          );
          if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
          res.json(result.rows[0]);
      } catch (err) {
          console.error('Error updating task:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.delete('/:id', async (req, res) => {
      const { id } = req.params;
      try {
          const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
          if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
          res.json({ message: 'Task deleted' });
      } catch (err) {
          console.error('Error deleting task:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  module.exports = router;