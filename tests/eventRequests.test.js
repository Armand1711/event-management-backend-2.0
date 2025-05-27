const request = require('supertest');
const express = require('express');
const eventRequestsRouter = require('../routes/eventRequests');

// Mock the pool object
jest.mock('../db', () => ({
  query: jest.fn()
}));
const pool = require('../db');

const app = express();
app.use(express.json());
app.use('/api/event-requests', eventRequestsRouter);

describe('Event Requests Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all event requests', async () => {
    const mockRequests = [
      { id: 1, name: 'Request 1', budget: 1000, client: 'Client 1', date: '2025-01-01', tasks: 5 }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockRequests });

    const res = await request(app).get('/api/event-requests');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockRequests);
  });

  it('should handle db errors', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/event-requests');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});