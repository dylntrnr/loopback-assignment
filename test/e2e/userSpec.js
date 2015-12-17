var request = require('supertest-as-promised');
var Chance = require('chance');
var P = require('bluebird');
var expect = require('chai').expect;
var app = require('../../server/server.js');

var chance = new Chance();
var DEFAULT_TTL = 1209600;

function clearDB() {
  return P.all([
    app.models.user.destroyAll(),
    app.models.AccessToken.destroyAll()
  ]);
}

function createUser() {
  return app.models.user.create({
    email: chance.email(),
    password: chance.word(),
    username: chance.word()
  });
}

describe('user', function() {
  describe('POST /api/users', function() {
    beforeEach(clearDB);
    it('should create user');
    it('should return error when missing email');
    it('should return error when email not unique');
    /*
     - use https://www.npmjs.com/package/slug
     - verify that user.username went through it
     */
    it('should slugify username');
  });
  describe('POST /api/users/{id}/rotate', function() {
    var context = {};
    beforeEach(function() {
      return clearDB().then(createUser).then(function(user) {
        context.user = user;
        return user.createAccessToken(DEFAULT_TTL);
      }).then(function(accessToken) {
        context.accessToken = accessToken;
      });
    });
    it('should return success', function() {
      return request(app)
        .post('/api/users/' + context.user.id + '/rotate')
        .set({'authorization': context.accessToken.id})
        .expect(204)
    });
    // TODO: verify that new random field is different than the old one
    it('should change "random" field');
  });
  //TODO: implement remote method inputValidator
  //Remove .skip to run this test
  describe.skip('POST /api/users/inputValidator', function() {
    var context = {};
    beforeEach(function() {
      return clearDB().then(createUser).then(function(user) {
        context.user = user;
      });
    });
    it('should return accept requests from anonymous user', function() {
      return request(app)
        .post('/api/users/inputValidator')
        .send({email: context.user.email})
        .expect(200);
    });
    it('should return false when email is not unique', function() {
      return request(app)
        .post('/api/users/inputValidator')
        .send({email: context.user.email})
        .then(function(res) {
          expect(res.body.email.unique).to.equal(false);
        });
    });
    it('should return true when email is unique', function() {
      return request(app)
        .post('/api/users/inputValidator')
        .send({email: chance.email()})
        .then(function(res) {
          expect(res.body.email.unique).to.equal(true);
        });
    });
  });
});