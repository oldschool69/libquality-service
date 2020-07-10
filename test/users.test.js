const request = require('supertest')
const expect = require('expect');
var app = require('../config/express').app;

describe('POST /api/v1/login', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/api/v1/login')
      .send({ user: 'oldschool69', pwd: "123456" })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        console.log('**res: ', res.body)
        done();
      });
  });
});
