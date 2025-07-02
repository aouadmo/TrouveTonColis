const request = require('supertest');
const app = require('../app');

//Côté client
it('Test récupération utilisateur par le token', async () => {
  const token = '2QW8_x0W7RIte1cIfrJfQNIvYa_d4nNk';
  const res = await request(app).get(`/users/client/${token}`);

  expect(res.status).toBe(200);
  expect(res.body.result).toBe(true);
});

//BDD Colis
it('Récupération colis par le trackingNumber', async () => {
  const trackingNumber = '1zmoiettoicecile';
  const res = await request(app).get(`/colis/search/${trackingNumber}`);

  expect(res.status).toBe(200);
  expect(res.body.found).toBe(true);
  expect(res.body.colis).toBeDefined();
  expect(res.body.colis.trackingNumber).toBe(trackingNumber);
});
