'use strict';
/*global describe */
/*global it */
/*global before */
var should         = require('should');
var request        = require('supertest');
var app            = require('../app');
var Client         = require('../api/client/client.model');
var Device         = require('../api/device/device.model');
var ServiceRequest = require('../api/service_request/service_request.model');
var handler        = require('./service_request.handler');
var async          = require('async');

var client1, client2, service_request, device;

function handleError(err, callback){
  if (err){ callback(err); }
}

function removeServiceRequests(callback){
  ServiceRequest.remove(function(err){
    handleError(err, callback);
    callback();
  });
}

function createServiceRequest(callback){
  ServiceRequest.create({
    serial: '1', 
    accesories: ['A', 'B'],
    defect: 'Test',
    _device: device._id,
    _client: client1._id
  }, function(err, _service_request){
    handleError(err, callback);
    service_request = _service_request;
    callback();
  });
}

function setDefaultServiceRequest(callback){
  service_request = new ServiceRequest({
    serial    : '1',
    accesories: ['A', 'B'],
    defect    : 'Test',
    device    : device._id
  });
  callback();
}

function removeClients(callback){
  Client.remove(function(err){
    handleError(err, callback);
    callback();
  });
}

function createClients(callback){
  var clients = [
    {
      name     : 'Test 1',
      docType  : 'Doc 1',
      docNumber: '1',
      phone    : '11',
      address  : 'Test',
      email    : '1@test.com'
    },
    {
      name     : 'Test 2',
      docType  : 'Doc 2',
      docNumber: '2',
      phone    : '22',
      address  : 'Test',
      email    : '2@test.com'
    }
  ];
  Client.create(clients, function(err, _client1, _client2){
    handleError(err, callback);
    client1 = _client1;
    client2 = _client2;
    callback();
  });
}

function removeDevices(callback){
  Device.remove({}, function(err){
    handleError(err, callback);
    callback();
  });
}

function createDevice(callback){
  Device.create({brand: 'Brand', model: 'Model', description: 'Des'}, function(err, _device){
    handleError(err, callback);
    device = _device;
    callback();
  });
}

describe('ServiceRequest manipulation', function(){
  before(function(done){
    async.waterfall([
      removeClients,
      createClients,
      removeDevices,
      createDevice,
      removeServiceRequests,
      createServiceRequest
    ], function(err){
      handleError(err, done);
      done();
    });
  });

  it('should begin with only two clients', function(done){
    Client.find({}, function(err, collection){
      handleError(err, done);
      collection.should.have.length(2);
      done();
    });
  });

  it('should begin with only one device', function(done){
    Device.find({}, function(err, collection){
      handleError(err, done);
      collection.should.have.length(1);
      done();
    });
  });

  it('should begin with only one service_request', function(done){
    ServiceRequest.find({}, function(err, collection){
      handleError(err, done);
      collection.should.have.length(1);
      done();
    });
  });

  describe('addServiceRequest(service_request_id, model_id)', function(){
    it('should add the service_request_id from the "serviceRequests" attribute', function(done){
      handler.addServiceRequest('Client',service_request._id, client1._id, function(){
        Client.findOne({_id: client1._id}, function(err, model){
          model.serviceRequests.should.have.length(1);
          done();
        });
      });
    });
  });
  
  describe('removeServiceRequest(service_request_id, model_id)', function(){
    it('should remove the service_request_id from the "serviceRequests" attribute', function(done){
      handler.addServiceRequest('Client',service_request._id, client1._id, function(){
        handler.removeServiceRequest('Client',service_request._id, client1._id, function(){
          Client.findOne({_id: client1._id}, function(err, model){
            model.serviceRequests.should.have.length(0);
            done();
          });
        });
      });
    });
  });

  describe('swapServiceRequest(service_request_id, old_model_id, new_model_id)', function(){
    before(function(done){
      handler.addServiceRequest('Client', service_request._id, client1._id, function(){
        handler.swapServiceRequest('Client', service_request._id, client1._id, client2._id, function(){
          done();
        });
      });
    });

    it('should have removed the service request from client1', function(done){
      Client.findOne({_id: client1._id}, function(err, model){
        if (err) { done(err); }
        model.serviceRequests.should.have.length(0);
        done(); 
      });
    });

    it('should have added the service request to client2', function(done){
      Client.findOne({_id: client2._id}, function(err, model){
        if (err) { done(err); }
        model.serviceRequests.should.have.length(1);
        done();
      });
    });

  });
});