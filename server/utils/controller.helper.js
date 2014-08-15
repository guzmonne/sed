'use strict';

var _                     = require('lodash');
var serviceRequestHandler = require('./service_request.handler');

function addUser(req){
	if (!_.isObject(req.body))      {throw new Error('"req.body" must be an object');}
	if (!_.isObject(req.user))      {throw new Error('"req.user" must be an object');}
	if (_.isUndefined(req.user._id)){throw new Error('"req.user._id" is undefined') ;}
	req.body.createdBy = (req.body.createdBy) ? req.body.createdBy : req.user._id;
	req.body.updatedBy = req.user._id;
};

function justIds(req){
  if (_.isObject(req.body._device)     && req.body._device._id)    { req.body._device     = req.body._device._id; }
  if (_.isObject(req.body._client)     && req.body._client._id)    { req.body._client     = req.body._client._id; }
  if (_.isObject(req.body._technician) && req.body._technician._id){ req.body._technician = req.body._technician._id; }
};

function removeUnwantedAttrs(req){
  if (req.body.createdBy){ delete req.body.createdBy; }
  if (req.body.createdAt){ delete req.body.createdAt; }
  if (req.body.updatedBy){ delete req.body.updatedBy; }
  if (req.body.updatedBy){ delete req.body.updatedBy; }
};

function setBody(req){
  addUser            (req);
  justIds            (req);
  removeUnwantedAttrs(req);
};

exports.removeServiceRequest = serviceRequestHandler.removeServiceRequest;
exports.addServiceRequest    = serviceRequestHandler.addServiceRequest;
exports.swapServiceRequest   = serviceRequestHandler.swapServiceRequest;
exports.addUser              = addUser;
exports.justIds              = justIds;
exports.removeUnwantedAttrs  = removeUnwantedAttrs;
exports.setBody              = setBody;