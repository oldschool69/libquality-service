const request = require('supertest')
var app = require('../config/express').app;
var Validator = require('jsonschema').Validator;
var v = new Validator();

var auth = {};
before(loginUser(auth));

const projectSchema = {
    "type": "array",
    "items": [
        {
            "type": "object",
            "properties": {
                "project_name": {
                    "type": "string"
                },
                "num_issues": {
                    "type": "integer"
                },
                "avg_age": {
                    "type": "integer"
                },
                "std_age": {
                    "type": "integer"
                }
            },
            "required": [
                "project_name",
                "num_issues",
                "avg_age",
                "std_age"
            ]
        }
    ]
}

describe('GET /api/v1/project-issues', function () {

    it('valid token', function (done) {
        request(app)
            .get('/api/v1/project-issues')
            .set('x-access-token', auth.token)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('invalid token', function (done) {
        request(app)
            .get('/api/v1/project-issues')
            .set('x-access-token', null)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
        });
    });

    it('verify body returned', function (done) {
        request(app)
            .get('/api/v1/project-issues')
            .set('x-access-token', auth.token)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                    if (err) return done(err)
                    const vResult = v.validate(res.body, projectSchema)
                    const numErrors = vResult['errors'].length
                    if (numErrors > 0) {
                        done("json body returned is invalid")
                    } else {
                        done();
                    }
            });
    });
});

describe('GET /api/v1/project-issues/:project_name', function () {

    it('valid token', function (done) {
        request(app)
            .get('/api/v1/project-issues/react')
            .set('x-access-token', auth.token)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('invalid token', function (done) {
        request(app)
            .get('/api/v1/project-issues/react')
            .set('x-access-token', null)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('verify body returned', function (done) {
        request(app)
            .get('/api/v1/project-issues/react')
            .set('x-access-token', auth.token)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                const vResult = v.validate(res.body, projectSchema)
                const numErrors = vResult['errors'].length
                if (numErrors > 0) {
                    done("json body returned is invalid")
                } else {
                    done();
                }
            });
    });

    it('invalid project', function (done) {
        request(app)
            .get('/api/v1/project-issues/xxx')
            .set('x-access-token', auth.token)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end(function (err, res) {
                const expectedMsg = "Not Found"
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


function loginUser(auth) {
    return function (done) {
        request(app)
            .post('/api/v1/login')
            .send({ user: 'oldschool69', pwd: "123456" })
            .set('Accept', 'application/json')
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
            auth.token = res.body.token;
            return done();
        }
    };
}