const should = require('chai').should();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.use(chaiHttp);

describe('POST /login', () => {
    it('it should not log in with incorrect password', (done) => {
        let user = {
            email: "admin@a",
            password: "wrongPassword"
        };
        chai.request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                res.should.have.status(401);
                done();
            });
    });
});
