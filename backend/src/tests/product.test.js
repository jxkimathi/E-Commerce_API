const request = require('supertest');
const { expect } = require('chai');
const { server } = require('../server');
const Product = require('../models/Product');

describe('Product Routes', () => {
  let token;
  let adminToken;
  let productId;

  before(async () => {
    // Login and get tokens
    const userResponse = await request(server)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });
    token = userResponse.body.token;

    const adminResponse = await request(server)
      .post('/api/auth/login')  
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminResponse.body.token;
  });

  describe('GET /api/products/fetch', () => {
    it('should get all products', async () => {
      const res = await request(server).get('/api/products/fetch');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/products/create', () => {
    it('should create new product if admin', async () => {
      const res = await request(server)
        .post('/api/products/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          category: 'Test Category'
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('name', 'Test Product');
      productId = res.body._id;
    });

    it('should not create product if not admin', async () => {
      const res = await request(server)
        .post('/api/products/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99
        });
      expect(res.status).to.equal(403);
    });
  });

  describe('GET /api/products/fetch/:id', () => {
    it('should get product by id', async () => {
      const res = await request(server)
        .get(`/api/products/fetch/${productId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', productId);
    });

    it('should return 404 if product not found', async () => {
      const res = await request(server)
        .get('/api/products/fetch/invalidid');
      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/products/update/:id', () => {
    it('should update product if admin', async () => {
      const res = await request(server)
        .put(`/api/products/update/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Product',
          price: 199.99
        });
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Updated Product');
    });

    it('should not update if not admin', async () => {
      const res = await request(server)
        .put(`/api/products/update/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Product'
        });
      expect(res.status).to.equal(403);
    });
  });

  describe('DELETE /api/products/delete/:id', () => {
    it('should delete product if admin', async () => {
      const res = await request(server)
        .delete(`/api/products/delete/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
    });

    it('should not delete if not admin', async () => {
      const res = await request(server)
        .delete(`/api/products/delete/${productId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(403);
    });
  });

  after(async () => {
    // Cleanup
    await Product.deleteMany({});
  });
});
