'use strict';

process.env.DBNAME = 'airbnb-test';
var request = require('supertest');
//var fs = require('fs');
//var exec = require('child_process').exec;
var app = require('../../app/app');
var expect = require('chai').expect;
var User;
//var cookie;
var u1;

describe('user', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({email:'athede@nomail.com', password:'1234', role:'host'});
      u1.register(function(){
        done();
      });
    });
  });

  describe('GET /register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .field('email', 'adam_thede@yahoo.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.include('Moved Temporarily. Redirecting to /');
        done();
      });
    });

    it('shold not register an already existing email address', function(done){
      request(app)
      .post('/register')
      .field('email', 'athede@nomail.com')
      .field('password', '1234')
      .field('role', 'host')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should pull up the login screen', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should log a user in', function(done){
      request(app)
      .post('/login')
      .field('email', 'athede@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.include('Moved Temporarily');
        done();
      });
    });

    it('should not log in a nonexisting user', function(done){
      request(app)
      .post('/login')
      .field('email', 'sam@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

});
