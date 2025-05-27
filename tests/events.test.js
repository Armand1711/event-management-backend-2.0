const request = require('supertest');
const express = require('express');
const eventsRouter = require('../routes/events');

// Mock the pool object
jest.mock('../db', () => ({
  query: jest.fn()
}));
const pool = require('../db');

const app = express();
app.use(express.json());
app.use('/api/events', eventsRouter);

describe('Events Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all events', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', client: 'Client 1', date: '2025-01-01', status: 'In Progress', progress: 50, completed: 5, total: 10, colorClass: 'yellow' }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockEvents });

    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockEvents);
  });

  it('should handle db errors', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});