'use strict';

var _              = require('lodash');
var async          = require('async');
var helper         = require('../../utils/controller.helper');
var ServiceRequest = require('./service_request.model');
var Log            = require('../log/log.model');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');

// Get list of service_requests
exports.index = function(req, res) {
  //ServiceRequest.find(function (err, service_requests) {
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
  setBody(req);
  ServiceRequest.create(req.body, function(err, service_request) {
    if(err) { return handleError(res, err); }
    async.parallel([
      function(callback){
        var options = [
          { path: '_device', select: '_id brand model description' },
          { path: '_client', select: '_id name' },
        ];
        ServiceRequest.populate(service_request, options, function(err){
          if (err) {callback(err);} else { callback(); }
        });
      },
      // Create Log
      function(callback){
        createLog(req.user._id, service_request._id, 'create');
        callback();
      },
      // Add service_request to client and device
      function(callback){
        helper.addServiceRequest('Client', service_request._id, service_request._client);
        helper.addServiceRequest('Device', service_request._id, service_request._device);
        callback();
      }
    ], function(err){
      if (err){ handleError(res, err); }
      return res.json(201, service_request);
    });
  });
};

// Updates an existing service_request in the DB.
exports.update = function(req, res) {
  setBody(req);
  if(req.body._id) { delete req.body._id; }
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if (err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    var clone   = _.pick(service_request, '_id', '_client', '_device');
    var updated = _.merge(service_request, req.body, function(a, b){return b});
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      createLog(req.user._id, service_request._id, 'update');
      checkUpdateLogClientAndDevice(clone, updated);
      return res.json(200, service_request);
    });
  });
};

// Patches an existing service_request in the DB.
exports.patch = function(req, res) {
  setBody(req);
  if(req.body._id) { delete req.body._id; }
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if (err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    var updated = _.merge(service_request, req.body, function(a, b){return b});
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      createLog(req.user._id, service_request._id, 'patch');
      checkAndLogCost(req, service_request._id);
      checkAndLogCostAccepted(req, service_request._id);
      return res.json(200, service_request);
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
      helper.removeServiceRequest('Client', service_request._id, service_request._client);
      helper.removeServiceRequest('Device', service_request._id, service_request._device);
      return res.send(204);
    });
  });
};

function setBody(req){
  req.body = helper.addUser(req.body, req.user);
  req.body = justDeviceAndClientIds(req.body);
}

function checkUpdateLogClientAndDevice(oldModel, newModel){
  var id = oldModel._id;
  if (!_.isUndefined(oldModel._client) && oldModel._client !== newModel._client){
    helper.swapServiceRequest('Client', id, oldModel._client, newModel._client, function(){
      createLog(newModel.updatedBy, id, 'update:client:' + newModel._client); 
    });
  }
  if (_.isUndefined(oldModel._device) && oldModel._device !== newModel._device){
    helper.swapServiceRequest('Device', id, oldModel._device, newModel._device, function(){
      createLog(newModel.updatedBy, id, 'update:device:' + newModel._device); 
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
    var msg = (req.body.costAccepted === true) ? "patch:costAccepted" : "patch:costAccepted:cancelled";
    createLog(req.user._id, id, msg); 
  }
}

function justDeviceAndClientIds(body){
  if (_.isObject(body._device) && body._device._id){ body._device = body._device._id; }
  if (_.isObject(body._client) && body._client._id){ body._client = body._client._id; }
  return body;
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