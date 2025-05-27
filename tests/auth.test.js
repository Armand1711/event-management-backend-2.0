const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');

// Mock the pool object
jest.mock('../db', () => ({
  query: jest.fn()
}));

const pool = require('../db');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({}); // For insert

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'testpass' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered');
  });

  it('should login an existing user', async () => {
    const hashedPassword = await require('bcryptjs').hash('testpass', 10);
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'test@example.com', password: hashedPassword }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'testpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const hashedPassword = await require('bcryptjs').hash('testpass', 10);
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'test@example.com', password: hashedPassword }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});