const request = require('supertest');
const express = require('express');
const budgetRouter = require('../routes/budget');

// Mock the pool object
jest.mock('../db', () => ({
  query: jest.fn()
}));
const pool = require('../db');

const app = express();
app.use(express.json());
app.use('/api/budget', budgetRouter);

describe('Budget Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all budget items', async () => {
    const mockItems = [
      { id: 1, event_id: 1, description: 'Venue', category: 'Venue', amount: 1000, status: 'Approved' }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockItems });

    const res = await request(app).get('/api/budget');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockItems);
  });

  it('should create a new budget item', async () => {
    const newItem = { event_id: 1, description: 'Catering', category: 'Food', amount: 500, status: 'Pending' };
    const createdItem = { id: 2, ...newItem };
    pool.query.mockResolvedValueOnce({ rows: [createdItem] });

    const res = await request(app).post('/api/budget').send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(createdItem);
  });

  it('should update a budget item', async () => {
    const updatedItem = { id: 1, event_id: 1, description: 'Updated', category: 'Venue', amount: 1200, status: 'Approved' };
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [updatedItem] });

    const res = await request(app).put('/api/budget/1').send(updatedItem);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(updatedItem);
  });

  it('should return 404 if updating non-existent item', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await request(app).put('/api/budget/999').send({
      event_id: 1, description: 'None', category: 'None', amount: 0, status: 'None'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a budget item', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{}] });

    const res = await request(app).delete('/api/budget/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Budget item deleted');
  });

  it('should return 404 if deleting non-existent item', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = await request(app).delete('/api/budget/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});