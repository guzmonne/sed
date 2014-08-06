'use strict';

var should         = require('should');
var app            = require('../app');
var request        = require('supertest');
var Client         = require('../api/client/client.model');
var ServiceRequest = require('../api/service_request/service_request.model');
var handler        = require('./service_request.handler');
var async          = require('async');

var client1, client2, service_request;

describe('ServiceRequest manipulation', function(){
  before(function(done){
    async.parallel([
      function(callback){
        ServiceRequest.remove().exec().then(function(){
          service_request = new ServiceRequest({
            serial: '1',
            accesories: ['1', '2'],
            defect: "Test"
          });
          service_request.save(function(err){ if (err){ callback(err); } else { callback(); } });
        });
      },
      function(callback){
        Client.remove().exec().then(function(){
          client1 = new Client({
            name     : 'Test 1',
            docType  : 'Doc 1',
            docNumber: '1',
            phone    : '11',
            address  : 'Test',
            email    : '1@test.com'
          });
          client2 = new Client({
            name     : 'Test 2',
            docType  : 'Doc 2',
            docNumber: '2',
            phone    : '22',
            address  : 'Test',
            email    : '2@test.com'
          });
          async.parallel([
            function(cb){
              client1.save(function(err){ if (err) { cb(err); } else { cb(); }});
            },
            function(cb){
              client2.save(function(err){ if (err) { cb(err); } else { cb(); }});
            }
          ], function(err){ if (err){ callback(err); } else { callback(); } } );
        });
      }
    ], function(err){ if (err){ done(err); } else { done(); } } );
  });

  it('should begin with only two clients', function(done){
    Client.find({}, function(err, collection){
      if (err) { return done(err); }
      collection.should.have.length(2);
      done();
    });
  });

  it('should begin with only one service_request', function(done){
    ServiceRequest.find({}, function(err, collection){
      if (err){ return done(err); }
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