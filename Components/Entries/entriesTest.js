const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

let token;
let id;
const wrongId = 108;
const noEntryid = 10102020;

const testUser = {
  email: '0000@mail.com',
  password: '1234AAbb#',
};

async function entriesTest() {
  chai.use(chaiHttp);
  await before(() => {
    chai
      .request(app)
      .post('/api/v1/users/signin')
      .send(testUser)
      .end((err, res) => {
        token = res.body.token;
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
    it('should throw an error if the request body is missing a required field', (done) => {
      chai
        .request(app)
        .post('/api/v1/entries')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals(
            'please provide all a title and entry for your log'
          );
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
    it('should throw an error if the id does not belong to any entry', (done) => {
      chai
        .request(app)
        .get(`/api/v1/entries/${noEntryid}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal(
            `no entry with the id: ${noEntryid}`
          );
          done();
        });
    });
    it('should throw an error if the user tries to access another persons entry', (done) => {
      chai
        .request(app)
        .get(`/api/v1/entries/${wrongId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal(
            'You do not have authoriazation to access this resource'
          );
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
    it('should throw an error if the request body is missing a required field', (done) => {
      chai
        .request(app)
        .put(`/api/v1/entries/${id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equals('please enter all fields');
          done();
        });
    });
    it('should throw an error if the user tries to edit an entry that does not exist', (done) => {
      chai
        .request(app)
        .put(`/api/v1/entries/${noEntryid}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ title: 'changed title', entry: 'change log' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal(
            `no entry with the id: ${noEntryid}`
          );
          done();
        });
    });
    it('should throw an error if the user tries to edit another users entry', (done) => {
      chai
        .request(app)
        .put(`/api/v1/entries/${wrongId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ title: 'changed title', entry: 'change log' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal(
            'you do not have authorization to edit this resource'
          );
          done();
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
    it('should throw an error if the user tries to delete an entry that does not exist', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/entries/${noEntryid}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal(
            `no entry with the id: ${noEntryid}`
          );
          done();
        });
    });

    it('should throw an error if the user tries to delete another users entry', (done) => {
      chai
        .request(app)
        .delete(`/api/v1/entries/${wrongId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal(
            'you are no authorized to delete this account'
          );
          done();
        });
    });
  });
}

module.exports = entriesTest;
