const should = require('chai').should();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');


chai.use(chaiHttp);

describe('Study program routes', () =>{
    describe('GET /', () => {
        it('it should GET all the study programs', (done) => {
            chai.request(server)
                .get('/studyProgram')
                .end((err,res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.not.eql(0);
                    done();
                })
        })
    })
})