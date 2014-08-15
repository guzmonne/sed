'use strict';

var should         = require('should');
var Log            = require('../log/log.model');
var ServiceRequest = require('./service_request.model');
var controller     = require('./service_request.controller');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');
var Technician     = require('../technician/technician.model');
var User           = require('../user/user.model');
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
      async.parallel([
        function(cb){
          Log.remove({}, function(err){
            if (err) { cb(err); } 
            cb();
          });
        },
        function(cb){
          User.remove({}, function(err){
            if (err){ cb(err); }
            user = new User({
              name    : "Service Request Controller Spec",
              email   : 'service_request.controller@spec.com',
              password: 'test'
            });
            user.save(function(err){
              if (err) {cb(err);} else { cb(); }
            });
          });
        }
      ], function(err){ if (err){done(err);}else{done();} })
    });
  });

  beforeEach(function(){
    model = helper.newServiceRequest();
  });

  afterEach(function(done){
    async.parallel([
      function(cb){
        ServiceRequest.remove({}, function(err){
          if (err){ cb(err); }
          model = null;
          cb();
        });
      },
      function(cb){
        Log.remove({}, function(err){
          if (err) { cb(err); } 
          cb();
        });
      }
    ], function(err){ if (err) { return done(err); } else { done(); } })
  });

  it('should begin with no models', function(done) {
    ServiceRequest.find({}, function(err, models) {
      if (err) { return done(err); }
      models.should.have.length(0);
      done();
    });
  });

  it('should begin with no logs', function(done){
    Log.find({}, function(err, models){
      if (err) { return done(err); }
      models.should.have.length(0);
      done();
    });
  });

  it('should begin with 1 client', function(done){
    Client.find({}, function(err, clients){
      if (err) { return done(err); }
      clients.should.have.length(1);
      done();
    });
  });

  it('should begin with 1 device', function(done){
    Device.find({}, function(err, devices){
      if (err) { return done(err); }
      devices.should.have.length(1);
      done();
    });
  });

  it('should begin with 1 user', function(done){
    User.find({}, function(err, users){
      if (err) { return done(err); }
      users.should.have.length(1);
      done();
    })
  });

  it('should require an authenticated user to continue', function(done){
  	server
  		.post('/auth/local')
  		.send({ email: 'service_request.controller@spec.com', password: 'test' })
  		.expect(200)
  		.end(function(err, res){
  			if (err) { return done(err); }
  			token = res.body.token;
				return done();
  		});
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

  describe('create', function(){
    
    before(function(done){
      model = helper.newServiceRequest();
      Log.remove({}, function(err){
        if (err) { return done(err); }
        done();
      });
    });

    it('should begin with 1 log', function(done){
      Log.find({}, function(err, models){
        if (err) { return done(err); }
        models.should.have.length(0);
        done();
      });
    });

    it('should create a "create" log document', function(done){
      server
        .post('/api/service_requests/')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(201)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: res.body._id, message: 'create'}, function(err, log){
            if (err){ done(err) }
            log.message.should.equal('create');
            done();
          });
        });
    });

    it('should add the model "_id" to the client', function(done){
      server
        .post('/api/service_requests/')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(201)
        .end(function(err, res){
          if (err) { return done(err); }
          Client.findOne({_id: res.body._client._id}, function(err, client){
            if(err){ return done(err); }
            (client.serviceRequests.indexOf(model._id) > -1).should.be.true;
            done();
          });
        });
    });

    it('should add the model "_id" to the device', function(done){
      server
        .post('/api/service_requests/')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(201)
        .end(function(err, res){
          if (err) { return done(err); }
          Device.findOne({_id: res.body._device._id}, function(err, device){
            if(err){ return done(err); }
            (device.serviceRequests.indexOf(model._id) > -1).should.be.true;
            done();
          });
        });
    });

  });

  describe('update', function(){
    var client2, device2;

    before(function(done){
      client2 = new Client({ name: 'Test 2', docType: 'C.I.', docNumber: '321' });
      device2 = new Device({ brand: 'Brand 2', model: 'Model 2', description: 'Desc 2' });
      async.parallel([
        function(cb){
          client2.save(function(err){
            if(err) { cb(err) } else { cb(); }
          });
        },
        function(cb){
          device2.save(function(err){
            if(err){ cb(err); } else { cb(); }
          });
        }
      ], function(err){ if (err){ done(err) } else { done(); } });
    });

    beforeEach(function(done){
      model = helper.newServiceRequest();
      server
        .post('/api/service_requests/')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(201)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.remove({}, function(err){
            if (err) { return done(err); }
            done();
          });
        });
    });

    after(function(done){
      async.parallel([
        function(cb){
          Client.remove({ _id: client2._id }, function(err){
            if(err) { cb(err) } else { cb(); }
          });
        },
        function(cb){
          Device.remove({ _id: device2._id }, function(err){
            if(err){ cb(err); } else { cb(); }
          });
        },
      ], function(err){ if (err){ done(err) } else { done(); } });
    });

    it('should begin with no logs', function(done){
      Log.find({}, function(err, collection){
        if (err) { return done(err); }
        collection.should.have.length(0);
        done();
      });
    });

    it('should begin with two clients', function(done){
      Client.find({}, function(err, collection){
        if (err) { return done(err); }
        collection.should.have.length(2);
        done();
      })
    });

    it('should begin with two devices', function(done){
      Device.find({}, function(err, collection){
        if (err) { return done(err); }
        collection.should.have.length(2);
        done();
      })
    });

    it('should begin with the serviceRequest on the client', function(done){
      Client.findOne({_id: client._id}, function(err, client){
        if (err){ done(err) }
        (client.serviceRequests.indexOf(model._id) > -1).should.be.true;
        done();
      });
    });

    it('should begin with the serviceRequest on the device', function(done){
      Device.findOne({_id: device._id}, function(err, device){
        if (err){ done(err) }
        (device.serviceRequests.indexOf(model._id) > -1).should.be.true;
        done();
      });
    });

    it('should create an "update" log document', function(done){
      model.diagnose = "Test"
      server
        .put('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'update'}, function(err, log){
            if (err){ done(err) }
            log.message.should.equal('update');
            done();
          });
        });
    });

    it('should move the serviceRequest to a new client if its changed', function(done){
      model._client = client2._id;
      server
        .put('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Client.findOne({_id: client2._id}, function(err, client){
            if (err){ done(err); }
            (client.serviceRequests.indexOf(model._id) > -1).should.be.true;
            done();
          });
        });
    });

    it('should remove the serviceRequest from the previous client if its changed', function(done){
      model._client = client2._id;
      server
        .put('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Client.findOne({_id: client._id}, function(err, client){
            if (err){ done(err); }
            (client.serviceRequests.indexOf(model._id) > -1).should.be.false;
            done();
          });
        });
    });

    it('should move the serviceRequest to a new device if its changed', function(done){
      model._device = device2._id;
      server
        .put('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Device.findOne({_id: device2._id}, function(err, device){
            if (err){ done(err); }
            (device.serviceRequests.indexOf(model._id) > -1).should.be.true;
            done();
          });
        });
    });

    it('should remove the serviceRequest from the previous device if its changed', function(done){
      model._device = device2._id;
      server
        .put('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send(model)
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Device.findOne({_id: device._id}, function(err, device){
            if (err){ done(err); }
            (device.serviceRequests.indexOf(model._id) > -1).should.be.false;
            done();
          });
        });
    });

  });

  describe('patch', function(){
    beforeEach(function(done){
      model = helper.newServiceRequest();
      model.save(function(err){
        if (err) { return done(err); }
        done();
      });
    });

    it('should begin with no logs', function(done){
      Log.find({}, function(err, models){
        if (err) { return done(err); }
        models.should.have.length(0);
        done();
      });
    });

    it('should create a "patch" log document', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch'}, function(err, log){
            if (err){ done(err) }
            log.message.should.equal('patch');
            done();
          });
        });
    });

    it('should create a "patch:cost:100" log if "req.body.cost" is 100"', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id, cost: 100})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch:cost:100'}, function(err, log){
            if (err){ done(err) } 
            log.message.should.equal('patch:cost:100');
            done();
          });
        });
    });

    it('should create a "patch:costAccepted:true" log if "req.body.costAccepted" is true"', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id, costAccepted: true})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch:costAccepted:true'}, function(err, log){
            if (err){ done(err) } 
            log.should.be.ok;
            done();
          });
        });
    });

    it('should create a "patch:costAccepted:false" log if "req.body.costAccepted" is false"', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id, costAccepted: false})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch:costAccepted:false'}, function(err, log){
            if (err){ done(err) } 
            log.should.be.ok;
            done();
          });
        });
    });

    it('should create a "patch:costAccepted:null" log if "req.body.costAccepted" is null"', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id, costAccepted: null})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch:costAccepted:null'}, function(err, log){
            if (err){ done(err) } 
            log.should.be.ok;
            done();
          });
        });
    });

    it('should create a "patch:technician:Test" log if "req.body.technician" a "_technician" id is passed', function(done){
      server
        .patch('/api/service_requests/' + model._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json, text/plain, */*')
        .send({ _id: model._id, _technician: technician._id})
        .expect(200)
        .end(function(err, res){
          if (err) { return done(err); }
          Log.findOne({doc: model._id, message: 'patch:technician:Test'}, function(err, log){
            if (err){ done(err) } 
            log.message.should.equal('patch:technician:Test');
            done();
          });
        });
    });
  });
});