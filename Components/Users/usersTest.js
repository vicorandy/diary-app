const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.use(chaiHttp);
const user = {
  firstname: 'test7',
  lastname: '007',
  email: '007@mail.com',
  password: '1234AAbb#',
};
let token;

function usersTest() {
  describe('POST /users/signup', () => {
    it('shouild create a new user', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.user.firstname).to.equal(user.firstname);
          expect(res.body.user.lastname).to.equal(user.lastname);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });
    it('should return a status code of 409 if the user alredy exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.message).to.equal(
            'This email address has already been registered to an account.'
          );
          done();
        });
    });
  });
  describe('POST /users/signin', () => {
    it('should login a user when all required data is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/signin')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.firstname).to.equal(user.firstname);
          expect(res.body.user.lastname).to.equal(user.lastname);
          expect(res.body.user.email).to.equal(user.email);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
  describe('POST /get_user_info', () => {
    it('gets user information using token', (done) => {
      chai
        .request(app)
        .post('/api/v1/users/get_user_info')
        .send({ token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.userInfo.username).to.equal(user.firstname);
          expect(res.body.userInfo.useremail).to.equal(user.email);
          done();
        });
    });
  });
  describe('POST /api/v1/users/delete_account', () => {
    it('delete a user account', (done) => {
      chai
        .request(app)
        .delete('/api/v1/users/delete_account')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal(
            'you have successfully closed your account.'
          );
          done();
        });
    });
  });
}

module.exports = usersTest;
