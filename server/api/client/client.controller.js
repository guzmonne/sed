'use strict';

var _              = require('lodash');
var Client         = require('./client.model');
var ServiceRequest = require('../service_request/service_request.model');
var helper         = require('../../utils/controller.helper');
var Log            = require('../log/log.model');

// Get list of clients
exports.index = function(req, res) {
  Client.find(function (err, clients) {
    if(err) { return handleError(res, err); }
    return res.json(200, clients);
  });
};

// Get a single client
exports.show = function(req, res) {
  function checkErrors(err, result){
    if (err) { return handleError(res, err); }
    if (!result) { return res.send(404); }
  }
  function populateServiceRequests(err, client){
    checkErrors(err, client);
    var options = {
      path: 'serviceRequests._device',
      model: 'Device',
      select: '_id brand model description',
    };
    ServiceRequest.populate(client, options, send);
  }
  function send(err, client){
    checkErrors(err, client);
    return res.json(client);
  }
  Client.findById(req.params.id).populate('serviceRequests').exec(populateServiceRequests);
};

// Creates a new client in the DB.
exports.create = function(req, res) {
  helper.addUser(req);
  Client.create(req.body, function(err, client) {
    if(err) { return handleError(res, err); }
    createLog(req.user._id, client._id, 'create');
    return res.json(201, client);
  });
};

// Updates an existing client in the DB.
exports.update = function(req, res) {
  helper.addUser(req);
  if(req.body._id) { delete req.body._id; }
  Client.findById(req.params.id, function (err, client) {
    if (err) { return handleError(err); }
    if(!client) { return res.send(404); }
    var updated = _.merge(client, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      createLog(req.user._id, client._id, 'update');
      return res.json(200, client);
    });
  });
};

// Deletes a client from the DB.
exports.destroy = function(req, res) {
  Client.findById(req.params.id, function (err, client) {
    if(err) { return handleError(res, err); }
    if(!client) { return res.send(404); }
    client.remove(function(err) {
      if(err) { return handleError(res, err); }
      createLog(req.user._id, client._id, 'delete');
      return res.send(204);
    });
  });
};

function createLog(usr, doc, msg){
  var log = new Log({
    user     : usr,
    col      : 'client',
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
};