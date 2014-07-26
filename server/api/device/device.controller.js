'use strict';

var _ = require('lodash');
var Device = require('./device.model');
var helper = require('../../utils/controller.helper');
var Log    = require('../log/log.model');

// Get list of devices
exports.index = function(req, res) {
  Device.find(function (err, devices) {
    if(err) { return handleError(res, err); }
    return res.json(200, devices);
  });
};

// Get a single device
exports.show = function(req, res) {
  Device.findById(req.params.id, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    return res.json(device);
  });
};

// Creates a new device in the DB.
exports.create = function(req, res) {
  req.body = helper.addUser(req.body, req.user);
  Device.create(req.body, function(err, device) {
    if(err) { return handleError(res, err); }
    createLog(req.user._id, device._id, 'create');
    return res.json(201, device);
  });
};

// Updates an existing device in the DB.
exports.update = function(req, res) {
  req.body = helper.addUser(req.body, req.user);
  if(req.body._id) { delete req.body._id; }
  Device.findById(req.params.id, function (err, device) {
    if (err) { return handleError(err); }
    if(!device) { return res.send(404); }
    var updated = _.merge(device, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      createLog(req.user._id, device._id, 'update');
      return res.json(200, device);
    });
  });
};

// Deletes a device from the DB.
exports.destroy = function(req, res) {
  Device.findById(req.params.id, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    device.remove(function(err) {
      if(err) { return handleError(res, err); }
      createLog(req.user._id, device._id, 'delete');
      return res.send(204);
    });
  });
};

function createLog(usr, doc, msg){
  var log = new Log({
    user     : usr,
    col      : 'device',
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