var _                     = require('lodash');
var serviceRequestHandler = require('./service_request.handler');

exports.addUser = function(target, user){
	if (!_.isObject(target))    {return console.log('"target" must be an object');}
	if (!_.isObject(user))      {return console.log('"user" must be an object');}
	if (_.isUndefined(user._id)){return console.log('"user._id" is undefined');}
	target.createdBy = (target.createdBy) ? target.createdBy : user._id;
	target.updatedBy = user._id;
	return target;
};

exports.removeServiceRequest = serviceRequestHandler.removeServiceRequest;

exports.addServiceRequest    = serviceRequestHandler.addServiceRequest;

exports.swapServiceRequest   = serviceRequestHandler.swapServiceRequest;