'use strict';

var should  = require('should');
var app     = require('../../app');
var request = require('supertest');
var Client  = require('./client.model');
var async   = require('async');

var model;

describe('Client Model', function() {
  before(function(done){
    model = new Client({
      name     : 'Test client',
      docType  : 'C.I.',
      docNumber: '420887413',
      address  : 'Address 1',
      phone    : '26962211'
    });

    // Clear clients before execute
    Client.remove().exec().then(function(){
      done();
    });
  });

  afterEach(function(done){
    Client.remove().exec().then(function(){
      done();
    });
  });

  it('should begin with no clients', function(done){
    Client.find({}, function(err, collection){
      collection.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate client', function(done){
    model.save(function(){
      var modelClone = new Client(model);
      modelClone.save(function(err){
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a docNumber', function(done){
    model.docNumber = null;
    model.save(function(err){
      should.exist(err);
      done();
    });
  });

  it('should leave only numbers on the docNumber field', function(done){
    model.docNumber = '1A';
    model.save(function(err, result){
      result.docNumber.should.equal('1');
      done();
    });
  });

  it('should leave only numbers on the phone field', function(done){
    model.phone = '1A';
    model.save(function(err, result){
      result.phone.should.equal('1');
      done();
    });
  });

  it('should have a createdAt date', function(done){
    model.save(function(err, result){
      should.exist(result.createdAt);
      var date = new Date(result.createdAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });

  it('should have a updatedAt date', function(done){
    model.save(function(err, result){
      should.exist(result.updatedAt);
      var date = new Date(result.updatedAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });
});