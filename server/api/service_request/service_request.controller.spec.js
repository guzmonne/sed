'use strict';

var should         = require('should');
var ServiceRequest = require('./service_request.model');
var controller     = require('./service_request.controller');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');
var Technician     = require('../technician/technician.model');
var helper         = require('../../utils/spec.helper.js');
var app            = require('../../app');
var request        = require('supertest');
var async          = require('async');

var user, token, model, device, client, technician;

var server = request.agent('http://localhost:9000');

var handleError = helper.handleError;

describe('Service Request Controller', function() {
  before(function(done){
    helper.setup(function(){
      client     = helper.client;
      device     = helper.device;
      technician = helper.technician;
      model      = helper.model;
      done();
    });
  });

  beforeEach(function(){
    model = helper.newServiceRequest();
    //res   = new Res();
  });

  afterEach(function(done){
    ServiceRequest.remove({}, function(){
      model = null;
      done();
    });
  });

  it('should begin with no models', function(done) {
    ServiceRequest.find({}, function(err, models) {
      models.should.have.length(0);
      done();
    });
  });

  it('should begin with 1 client', function(done){
    Client.find({}, function(err, clients){
      clients.should.have.length(1);
      done();
    });
  });

  it('should begin with 1 device', function(done){
    Device.find({}, function(err, devices){
      devices.should.have.length(1);
      done();
    });
  });

  it('should require an authenticated user to continue', function(done){
  	server
  		.post('/auth/local')
  		.send({ email: 'test@test.com', password: 'test' })
  		.expect(200)
  		.end(function(err, res){
  			if (err) { return done(err); }
  			token = res.body.token;
				return done();
  		});
  });

  it('should be able to get the user info from the server', function(done){
		server
			.get('/api/users/me')
			.set('Authorization', 'Bearer ' + token)
			.set('Accept', 'application/json, text/plain, */*')
			.expect(200)
			.end(function(err, res){
				if (err) { return done(err); }
				user = res.body;
				done();
			})
  });

	describe('index', function(){
		it('should return all the service requests on the database', function(done){
			model.save(function(err){
				handleError(err, done);
				server
					.get('/api/service_requests')
					.set('Authorization', 'Bearer ' + token)
   				.set('Accept', 'application/json, text/plain, */*')
					.expect(200)
					.end(function(err, res){
						handleError(err, done);
						res.body.should.be.instanceof(Array);
						done();
					});
			});
		});
  });

  describe('patch', function(){
  	it('TODO')
  });
});