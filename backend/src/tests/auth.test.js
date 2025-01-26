// Authentiation tests using mocha
const request = require('supertest');
const server = require('../server');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clear users before each test
  });

  describe('POST /signup', () => {
    it('should create a new user and return token', async () => {
      const res = await request(server)
        .post('/signup')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@test.com');
    });

    it('should return error if email already exists', async () => {
      await User.create({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });

      const res = await request(server)
        .post('/signup')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await User.create({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });
    });

    it('should login user and return token', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should return error for invalid credentials', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /authenticate', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(server)
        .get('/authenticate');

      expect(res.statusCode).toBe(401);
    });

    it('should authenticate valid token', async () => {
      const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET);

      const res = await request(server)
        .get('/authenticate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /register-admin', () => {
    it('should create a new admin and return token and role', async () => {
      const res = await request(server)
        .post('/register-admin')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.role).toBe('admin');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@test.com');
    })
  });
});
