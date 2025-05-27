const request = require('supertest');
const express = require('express');
const tasksRouter = require('../routes/tasks');

// Mock the pool object
jest.mock('../db', () => ({
  query: jest.fn()
}));
const pool = require('../db');

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);

describe('Tasks Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all tasks', async () => {
    const mockTasks = [
      { id: 1, event_id: 1, title: 'Task 1', priority: 'High', priorityClass: 'red', assignedTo: 'John', dueDate: '2025-01-01', status: 'In Progress', budget: 100, completed: false }
    ];
    pool.query.mockResolvedValueOnce({ rows: mockTasks });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockTasks);
  });

  it('should handle db errors', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});