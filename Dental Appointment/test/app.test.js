// app.test.js
const request = require('supertest');
const session = require('supertest-session');
const express = require('express');
const app = express();
const router = require('../routes/loginRoute');
//const main = require('../main');
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

let testSession = null;

beforeEach(function () {
    testSession = session(app);
  });

jest.mock('../models/patient', () => {
  return {
    findOne: jest.fn().mockImplementation((obj) => {
      if (obj.name === 'validName') {
        return Promise.resolve({
          name: 'validName',
          email: 'validEmail',
        });
      } else {
        return Promise.resolve(null);
      }
    }),
  };
});

describe('Login Form', () => {
  it('renders the login form', async () => {
    const response = await request(app).get('/Userlogin');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('User Login');
  });

  it('handles login with valid credentials', async () => {
    const response = await testSession.post('/Userlogin')
      .send({ name: 'validName', email: 'validEmail' });
  
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/index');//should redirect to index.ejs not Userlogin
  });
  
  it('handles login with invalid credentials', async () => {
    const response = await request(app)
      .post('/Userlogin')
      .send({ name: 'invalidName', email: 'invalidEmail' });
  
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/Userlogin');
  });
});

