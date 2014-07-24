'use strict';

var _ = require('lodash');
var ServiceRequest = require('./service_request.model');

// Get list of service_requests
exports.index = function(req, res) {
  ServiceRequest.find(function (err, service_requests) {
    if(err) { return handleError(res, err); }
    return res.json(200, service_requests);
  });
};

// Get a single service_request
exports.show = function(req, res) {
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if(err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    return res.json(service_request);
  });
};

// Creates a new service_request in the DB.
exports.create = function(req, res) {
  ServiceRequest.create(req.body, function(err, service_request) {
    if(err) { return handleError(res, err); }
    return res.json(201, service_request);
  });
};

// Updates an existing service_request in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if (err) { return handleError(err); }
    if(!service_request) { return res.send(404); }
    var updated = _.merge(service_request, req.body);
    updated.save(function (err) {
      if (err) { return handleError(err); }
      return res.json(200, service_request);
    });
  });
};

// Deletes a service_request from the DB.
exports.destroy = function(req, res) {
  ServiceRequest.findById(req.params.id, function (err, service_request) {
    if(err) { return handleError(res, err); }
    if(!service_request) { return res.send(404); }
    service_request.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}