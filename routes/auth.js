const express = require('express');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const pool = require('../db');

  const router = express.Router();

  router.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
          const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
          const user = result.rows[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ token, userId: user.id });
      } catch (err) {
          console.error('Login error:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  router.post('/signup', async (req, res) => {
      const { email, password } = req.body;
      try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);
          res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
      } catch (err) {
          console.error('Signup error:', err.stack);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

  module.exports = router;