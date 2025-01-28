// Authentication tests
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { server } = require('../server');


describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /is-admin', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(server)
        .get('/is-admin');
      
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const user = await User.create({
        email: 'user@test.com',
        password: 'password123',
        name: 'Regular User',
        role: 'user'
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      const res = await request(server)
        .get('/is-admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 200 for admin user', async () => {
      const admin = await User.create({
        email: 'admin@test.com',
        password: 'password123', 
        name: 'Admin User',
        role: 'admin'
      });

      const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

      const res = await request(server)
        .get('/is-admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /signup validation', () => {
    it('should return 400 for invalid email format', async () => {
      const res = await request(server)
        .post('/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for password less than 6 characters', async () => {
      const res = await request(server)
        .post('/signup')
        .send({
          email: 'test@test.com',
          password: '12345',
          name: 'Test User' 
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /login edge cases', () => {
    it('should return 404 for non-existent user', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing credentials', async () => {
      const res = await request(server)
        .post('/login')
        .send({
          email: 'test@test.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error'); 
    });
  });

  describe('POST /authenticate', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(server).post('/authenticate');
      expect(res.statusCode).toBe(401);
    });

    it('should return 200 with valid token', async () => {
      const user = await User.create({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      const res = await request(server)
        .post('/authenticate')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
    });
  });

  describe('POST /register-admin', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(server)
        .post('/register-admin')
        .send({
          email: 'newadmin@test.com',
          password: 'password123',
          name: 'New Admin'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if non-admin user tries to register admin', async () => {
      const user = await User.create({
        email: 'user@test.com',
        password: 'password123',
        name: 'Regular User',
        role: 'user'
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      const res = await request(server)
        .post('/register-admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newadmin@test.com',
          password: 'password123',
          name: 'New Admin'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should successfully register new admin if requested by admin', async () => {
      const admin = await User.create({
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin'
      });

      const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

      const res = await request(server)
        .post('/register-admin')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newadmin@test.com',
          password: 'password123',
          name: 'New Admin'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });
  });
});
