const should = require('chai').should();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.use(chaiHttp);

describe('Faculty Routes', () => {

    describe('PUT /:id', () => {
        it('it should UPDATE a faculty given the id', (done) => {
            let facultyToUpdate = {
                name: "Univerza v Ljubljani",
                university_id: 1 
            };

            const facultyIdToUpdate = 1; 

            chai.request(server)
                .put('/faculty/' + facultyIdToUpdate)
                .send(facultyToUpdate)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.text.should.be.eql('Faculty updated successfully');
                    done();
                });
        });
    });


});
