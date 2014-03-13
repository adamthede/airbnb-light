/* jshint expr:true */

'use strict';

process.env.DBNAME = 'airbnb-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;
var bob;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({role:'host', email:'athede@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('athede@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.role).to.equal('host');
    });
  });

  describe('#register', function(){
    it('should register a new User', function(done){
      var u1 = new User({role:'guest', email:'adam_thede@yahoo.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
        expect(body.id).to.be.ok;
        done();
      });
    });

    it('should not register a new User if email already exists', function(done){
      var u1 = new User({role:'guest', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user by email and password', function(done){
      var u1 = new User({role:'Host', email:'athede@nomail.com', password:'1234'});
      u1.register(function(){
        User.findByEmailAndPassword('athede@nomail.com', '1234', function(record){
          expect(record.email).to.equal('athede@nomail.com');
          expect(record.password).to.not.equal('1234');
          done();
        });
      });
    });

    it('should not allow an incorrect email', function(done){
      var u1 = new User({role:'Host', email:'athede@nomail.com', password:'1234'});
      u1.register(function(){
        User.findByEmailAndPassword('charles@nomail.com', '1234', function(record){
          expect(record).to.be.null;
          done();
        });
      });
    });

    it('should not allow an incorrect password', function(done){
      var u1 = new User({role:'Host', email:'athede@nomail.com', password:'1234'});
      u1.register(function(){
        User.findByEmailAndPassword('athede@nomail.com', '1235', function(record){
          expect(record).to.be.null;
          done();
        });
      });
    });
  });
});
