'use strict';

var should  = require('should');
var app     = require('../../app');
var request = require('supertest');
var Device  = require('./device.model');

var model;

describe('Device Model', function(){
  beforeEach(function(done){
    model = new Device({
      model      : "Aspire E1 571.688",
      brand      : "Acer",
      description: "Notebook"
    });

    // Clear devices before execute
    Device.remove().exec().then(function(){
      done();
    }); 
  });

  afterEach(function(done){
    Device.remove().exec().then(function(){
      done();
    });
  });

  it('should begin with no devices', function(done){
    Device.find({}, function(err, collection){
      collection.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate device', function(done){
    model.save(function(){
      var clone = new Device(model);
      clone.save(function(err){
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a "model"', function(done){
    model.model = null;
    model.save(function(err){ should.exist(err); done(); });
  });

  it('should fail when saving without a "brand"', function(done){
    model.brand = null;
    model.save(function(err){ should.exist(err); done(); });
  });

  it('should fail when saving without a "description"', function(done){
    model.description = null;
    model.save(function(err){ should.exist(err); done(); });
  });

  it('should have a "createdAt" date', function(done){
    model.save(function(err, result){
      should.exist(result.createdAt);
      var date = new Date(result.createdAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });

  it('should have an "updatedAt" date', function(done){
    model.save(function(err, result){
      should.exist(result.updatedAt);
      var date = new Date(result.updatedAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });
});