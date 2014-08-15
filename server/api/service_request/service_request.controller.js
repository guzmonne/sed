'use strict';

var _              = require('lodash');
var async          = require('async');
var helper         = require('../../utils/controller.helper');
var ServiceRequest = require('./service_request.model');
var Log            = require('../log/log.model');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');
var Technician     = require('../technician/technician.model');

// Get list of service_requests
exports.index = function(req, res) {
  ServiceRequest.index(function (err, service_requests) {
    if(err) { return handleError(res, err); }
    return res.json(200, service_requests);
  });
};

// Get a single service_request
exports.show = function(req, res) {
  //ServiceRequest.findById(req.params.id, function (err, service_request) {
  ServiceRequest.show(req.params.id, function (err, service_request) {
    if(err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    return res.json(service_request);
  });
};

// Creates a new service_request in the DB.
exports.create = function(req, res) {
  helper.setBody(req);
  ServiceRequest.create(req.body, function(err, service_request) {
    if(err) { return handleError(res, err); }
    async.parallel([
      function(callback){
        var options = [
          { path: '_device'    , select: '_id brand model description' },
          { path: '_client'    , select: '_id name' },
          { path: '_technician', select: 'name' }
        ];
        ServiceRequest.populate(service_request, options, function(err){ if (err) {callback(err);} else { callback(); } });
      },
      // Create Log
      function(callback){ createLog(req.user._id, service_request._id, 'create'); callback(); },
      // Add service_request to client
      function(callback){ helper.addServiceRequest('Client', service_request._id, service_request._client); callback(); },
      // Add service_request to device
      function(callback){ helper.addServiceRequest('Device', service_request._id, service_request._device); callback(); }
    ], function(err){
      if (err){ handleError(res, err); }
      return res.json(201, service_request);
    });
  });
};

// Updates an existing service_request in the DB.
exports.update = function(req, res) {
  helper.setBody(req);
  if(req.body._id) { delete req.body._id; }
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if (err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    var clone   = _.pick(service_request, '_id', '_client', '_device');
    var updated = _.merge(service_request, req.body, function(a, b){return b});
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      createLog(req.user._id, service_request._id, 'update');
      handleServiceRequestRefs(clone, updated, function(){
        return res.json(200, service_request);
      });
    });
  });
};

// Patches an existing service_request in the DB.
exports.patch = function(req, res) {
  helper.setBody(req);
  if(req.body._id) { delete req.body._id; }
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if( err)             { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    var _technician = _.pick(service_request, '_id', '_technician'); 
    var updated     = _.merge(service_request, req.body, function(a, b){return b});
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      //createLog              (req.user._id, service_request._id, 'patch');
      checkAndLogCost        (req, service_request._id);
      checkAndLogCostAccepted(req, service_request._id);
      if (req.body._technician) {
        updated.populate('_technician', 'name', function(err, result){
          checkUpdateAndLogTechnician(_technician, updated);
          if (err){ handleError(res, err); }
          res.json(200, updated);
        });
      } else {
        return res.json(200, service_request);
      }
    });
  });//
};

// Deletes a service_request from the DB.
exports.destroy = function(req, res) {
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if(err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    service_request.remove(function(err) {
      if(err) { return handleError(res, err); }
      createLog(req.user._id, service_request._id, 'delete');
      helper.removeServiceRequest('Client'    , service_request._id, service_request._client);
      helper.removeServiceRequest('Device'    , service_request._id, service_request._device);
      helper.removeServiceRequest('Technician', service_request._id, service_request._technician);
      return res.send(204);
    });
  });
};

function handleServiceRequestRefs(clone, updated, callback){
  if ( !_.isEqual( clone._client, updated._client ) ) {
    checkUpdateAndLogClient(clone, updated, function(){
      return callback();
    });
  } else if (!_.isEqual( clone._device, updated._device )){
    checkUpdateAndLogDevice(clone, updated, function(){
      return callback();
    });
  } else {
    return callback();
  }
}

function checkUpdateAndLogClient(clone, updated, callback){
  helper.swapServiceRequest('Client', updated._id, clone._client, updated._client, function(){
    Client.find({ _id: updated._client }).limit(1).exec(function(err, collection){
      if (err){ return console.log(err); }
      if (collection.length === 0){ return; }
      var client = collection[0];
      createLog(updated.updatedBy, updated._id, 'update:client:' + client.name);
      callback();
    });
  });
}

function checkUpdateAndLogDevice(clone, updated, callback){
  helper.swapServiceRequest('Device', updated._id, clone._device, updated._device, function(){
    Device.find({ _id: updated._device }).limit(1).exec(function(err, collection){
      if (err){ return console.log(err); }
      if (collection.length === 0){ return; }
      var device = collection[0];
      createLog(updated.updatedBy, updated._id, 'update:device:' + device.model); 
      callback();
    });
  });
}

function checkUpdateAndLogTechnician(oldModel, newModel){
  if(_.isUndefined(oldModel._technician) || oldModel._technician !== newModel._technician._id){
    helper.swapServiceRequest('Technician', oldModel._id, oldModel._technician, newModel._technician._id, function(){
      createLog(newModel.updatedBy, oldModel._id, 'patch:technician:' + newModel._technician.name); 
    });
  }
}

function checkAndLogCost(req, id){
  if (req.body.cost){ 
    createLog(req.user._id, id, 'patch:cost:' + req.body.cost); 
  }
}

function checkAndLogCostAccepted(req, id){
  if (!_.isUndefined(req.body.costAccepted)) { 
    var msg = (req.body.costAccepted === null) ? "patch:costAccepted:null" : "patch:costAccepted:" + req.body.costAccepted.toString();
    createLog(req.user._id, id, msg); 
  }
}

function createLog(usr, doc, msg){
  var log = new Log({
    user     : usr,
    col      : 'service_request',
    doc      : doc,
    message  : msg,
    type     : 'LOG',
    createdAt: new Date()
  });
  log.save(function(err){
    if (err) { return handleError(err); }
  });
}

function handleError(res, err) {
  return res.send(500, err);
}