'use strict';

var should         = require('should');
var ServiceRequest = require('./service_request.model');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');
var async          = require('async');

var model, device, client;

function createDevice(callback){
  device = new Device({
    brand      : "Marca",
    model      : "Modelo",
    description: "Descripición"
  });
  device.save(function(err){
    if (err){console.log(err);}
    callback(null);
  });
}

function createClient(callback){
  client = new Client({
    name     : "Test",
    docType  : "C.I.",
    docNumber: "123",
    phone    : "123",
    address  : "Test 123",
    email    : "test@example.com"
  });
  client.save(function(err){
    if (err){console.log(err);}
    callback(null);
  });
}

describe('Service Request Model', function() {
  before(function(done){
    async.parallel([
      function(cb){
        Client.remove({}, function(){
          client = null;
          createClient(cb);
        });
      },
      function(cb){
        Device.remove({}, function(){
          device = null;
          createDevice(cb);
        });
      },
      function(cb){
        ServiceRequest.remove({}, function(){
          model = null;
          cb(null);
        });
      },
    ], function(err){
      if (err) {console.log(err);}
      model = new ServiceRequest({
        _client : client._id,
        _device : device._id,
        accessories : ['ac1', 'ac2'],
        serial: '123',
        defect: 'Test'
      });
      done();
    });
  });

  beforeEach(function(){
    model = new ServiceRequest({
      _client : client._id,
      _device : device._id,
      accessories : ['ac1', 'ac2'],
      serial: '123',
      defect: 'Test'
    });
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

  it('should pass if everything is ok', function(done){
    model.save(function(err, result){
      (err === null).should.be.true;
      done();
    });
  });

  it('should fail if client does not exist', function(done){
    model._client = 1;
    model.save(function(err){
      should.exist(err);
      done();
    });
  });

  it('should fail if device does not exist', function(done){
    model._device = 1;
    model.save(function(err){
      should.exist(err);
      done();    
    });
  });

  it('should create an ID attribute after save', function(done){
    model.save(function(err, result){
      result.id.should.be.a.Number;
      done();
    });
  });

  it('should set the "costAcceptedAt" date if "costAccepted" is true', function(done){
    model.costAccepted = true;
    model.save(function(err, result){
      (new Date(result.costAcceptedAt)).should.be.a.Date;
      done();
    }); 
  });

  it('should set the status to "En Reparación" if costAccepted is true', function(done){
    model.costAccepted = true;
    model.save(function(err, result){
      result.status.should.equal("En Reparación");
      done();
    });
  });

  it('should remove the "costAcceptedAt" date if "costAccepted" is false', function(done){
    model.costAccepted = true;
    model.save(function(){
      model.costAccepted = false;
      model.save(function(err, result){
        (result.costAcceptedAt === null).should.be.true;
        done();
      });
    });
  });


  it('should set the "status" to "Esperando Aprobación" if "costAccepted" is false', function(done){
    model.costAccepted = true;
    model.save(function(){
      model.costAccepted = false;
      model.save(function(err, result){
        result.status.should.equal("Esperando Aprobación");
        done();
      });
    });
  });

  it('should set the status to "Pendiente" by default', function(done){
    model.save(function(err, result){
      result.status.should.equal('Pendiente');
      done();
    });
  });

  it('should set the "closedAt" date if status equals "Cerrado"', function(done){
    model.status = "Cerrado";
    model.save(function(err, result){
      (result.closedAt === undefined).should.not.be.true;
      var date = new Date(result.closedAt);
      date.should.be.instanceOf(Date);
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