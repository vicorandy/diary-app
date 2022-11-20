const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

let token;
let id;

const testUser = {
  email: '0000@mail.com',
  password: '1234AAbb#',
};

function entriesTest() {
  chai.use(chaiHttp);
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(testUser)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  describe('GET /entries', () => {
    it('should fetch all entries for a user', (done) => {
      chai
        .request(app)
        .get('/api/v1/entries')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('count');
          done();
        });
    });
  });

  describe('POST /entries', () => {
    it('should create a new entry for a user', (done) => {
      chai
        .request(app)
        .post('/api/v1/entries')
        .set({ Authorization: `Bearer ${token}` })
        .send({ title: 'chai test trial', entry: 'i hope this works' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.equals('entry has been logged');
          expect(res.body).to.have.property('data');
          expect(res.body.data.title).to.equal('chai test trial');
          expect(res.body.data.entry).to.equal('i hope this works');
          id = res.body.data.id;
          done();
        });
    });
  });
  describe('GET /entries/:id', () => {
    it('should get a specified entry', (done) => {
      chai
        .request(app)
        .get(`/api/v1/entries/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Request successful');
          expect(res.body).to.have.property('data');
          done();
        });
    });
  });

  describe('PUT /entries:id', () => {
    it('should edit a user entry', () => {
      chai
        .request(app)
        .put(`/api/v1/entries/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ title: 'changed title', entry: 'change log' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('entry has been edited');
        });
    });
  });

  describe('DELETE /entries/:id', () => {
    it('should edit a user entry', () => {
      chai
        .request(app)
        .delete(`/api/v1/entries/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            `the entry with the id: ${id} has been deleted sucessfully`
          );
        });
    });
  });
}

module.exports = entriesTest;
