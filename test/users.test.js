const request = require('supertest')
const expect = require('expect');
var app = require('../config/express').app;

describe('POST /api/v1/login', function () {
  
  it('valid credentials', function (done) {
    request(app)
      .post('/api/v1/login')
      .send({ user: 'oldschool69', pwd: "123456" })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('user not found', function (done) {
    request(app)
      .post('/api/v1/login')
      .send({ user: 'unknown', pwd: "123456" })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(500)
      .end(function (err, res) {
        const expectedMsg = "Login failure, user not found"
        if (err) return done(err);
        if (res && res.body) {
          if (!res.body.message) {
            done("message field not present on body")
          } else {
            if (res.body.message != expectedMsg) {
              done(`"message" is incorrect:
                    got: ${res.body.message} 
                    should be: ${expectedMsg}`)
            } else {
              done()
            }
          }
        }
      });
  });

  it('invalid credentials', function (done) {
    request(app)
      .post('/api/v1/login')
      .send({ user: 'oldschool69', pwd: "123" })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(500)
      .end(function (err, res) {
        const expectedMsg = "Login failure, wrong user or pasword"
        if (err) return done(err);
        if (res && res.body) {
          if (!res.body.message) {
            done("message field not present on body")
          } else {
            if (res.body.message != expectedMsg) {
              done(`"message" is incorrect:
                    got: ${res.body.message} 
                    should be: ${expectedMsg}`)
            } else {
              done()
            }
          }
        }
      });
  });
});

// describe('POST /api/v1/login (user not found on database)', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/api/v1/login')
//       .send({ user: 'unknown', pwd: "123456" })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', 'application/json; charset=utf-8')
//       .expect(500)
//       .end(function (err, res) {
//         const expectedMsg = "Login failure, user not found"
//         if (err) return done(err);
//         if (res && res.body) {
//           if (!res.body.message) {
//             done("message field not present on body")
//           } else {
//             if (res.body.message != expectedMsg) {
//               done(`"message" is incorrect:
//                     got: ${res.body.message} 
//                     should be: ${expectedMsg}`)
//             } else {
//               done()
//             }
//           }
//         }
//       });
//   });
// });

// describe('POST /api/v1/login (invalid credentials)', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/api/v1/login')
//       .send({ user: 'oldschool69', pwd: "123" })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', 'application/json; charset=utf-8')
//       .expect(500)
//       .end(function (err, res) {
//         const expectedMsg = "Login failure, wrong user or pasword"
//         if (err) return done(err);
//         if (res && res.body) {
//           if (!res.body.message) {
//             done("message field not present on body")
//           } else {
//             if (res.body.message != expectedMsg) {
//               done(`"message" is incorrect:
//                     got: ${res.body.message} 
//                     should be: ${expectedMsg}`)
//             } else {
//               done()
//             }
//           }
//         }
//       });
//   });
// });
