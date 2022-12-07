const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const wrongToken = 'wrongtoken';

async function authenticationTest() {
  chai.use(chaiHttp);
  describe('authtentication middleware', () => {
    it('it should throw an error if request does not have authorization header', (done) => {
      chai
        .request(app)
        .get('/api/v1/entries')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equals('invalid user token');
          done();
        });
    });
    it('it should throw an error if token is invalid', (done) => {
      chai
        .request(app)
        .get('/api/v1/entries')
        .set({ Authorization: `Bearer ${wrongToken}` })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equals('invalid user token');
          done();
        });
    });
  });
}

module.exports = authenticationTest;
