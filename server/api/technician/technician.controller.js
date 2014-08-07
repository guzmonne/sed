'use strict';

var _              = require('lodash');
var Technician     = require('./technician.model');
var ServiceRequest = require('../service_request/service_request.model');
var helper         = require('../../utils/controller.helper');
var Log            = require('../log/log.model');

// Get list of technicians
exports.index = function(req, res) {
  Technician.find(function (err, technicians) {
    if(err) { return handleError(res, err); }
    return res.json(200, technicians);
  });
};

// Get a single technician
exports.show = function(req, res) {
  function checkErrors(err, result){
    if (err) { return handleError(res, err); }
    if (!result) { return res.send(404); }
  }
  function populateServiceRequests(err, technician){
    checkErrors(err, technician);
    var options = [
      { path: 'serviceRequests._device', model: 'Device', select: '_id brand model description' },
      { path: 'serviceRequests._client', model: 'Client', select: '_id name' },
    ];
    ServiceRequest.populate(technician, options, send);
  }
  function send(err, technician){
    checkErrors(err, technician);
    return res.json(technician);
  }
  Technician.findById(req.params.id).populate('serviceRequests').exec(populateServiceRequests);
};

// Creates a new technician in the DB.
exports.create = function(req, res) {
  req.body = helper.addUser(req.body, req.user);
  Technician.create(req.body, function(err, technician) {
    if(err) { return handleError(res, err); }
    createLog(req.user._id, technician._id, 'create');
    return res.json(201, technician);
  });
};

// Updates an existing technician in the DB.
exports.update = function(req, res) {
  req.body = helper.addUser(req.body, req.user);
  if(req.body._id) { delete req.body._id; }
  Technician.findById(req.params.id, function (err, technician) {
    if (err) { return handleError(err); }
    if(!technician) { return res.send(404); }
    var updated = _.merge(technician, req.body);
    updated.save(function (err) {
      if (err) { return handleError(err); }
      createLog(req.user._id, technician._id, 'update');
      return res.json(200, technician);
    });
  });
};

// Deletes a technician from the DB.
exports.destroy = function(req, res) {
  Technician.findById(req.params.id, function (err, technician) {
    if(err) { return handleError(res, err); }
    if(!technician) { return res.send(404); }
    technician.remove(function(err) {
      if(err) { return handleError(res, err); }
      createLog(req.user._id, technician._id, 'delete');
      return res.send(204);
    });
  });
};

function createLog(usr, doc, msg){
  var log = new Log({
    user     : usr,
    col      : 'technician',
    doc      : doc,
    message  : msg,
    type     : 'LOG',
    createdAt: new Date()
  });
  log.save(function(err){
    if (err) { return handleError(err); }
  });
};


function handleError(res, err) {
  return res.send(500, err);
}