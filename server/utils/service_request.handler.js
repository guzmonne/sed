var mongoose = require('mongoose');
var _        = require('lodash');
var async    = require('async');

function end(err, callback){
	if (_.isFunction(callback)){ callback(err); }
	else if (!_.isNull(err)){ console.log(err); }
}

function removeServiceRequest(modelName , service_request_id, model_id, callback){
	mongoose.models[modelName].findOne({_id: model_id}, function(err, model){
		if (err) { return end(err, callback); }
		if (!model){ return(null, callback); }
		var index = model.serviceRequests.indexOf(service_request_id);
		if (index > -1){ 
			model.serviceRequests.splice(index, 1); 
			model.save(function(err){ end(err, callback); });
		}else {
			end(null, callback);
		}
	});
}

function addServiceRequest(modelName , service_request_id, model_id, callback){
	mongoose.models[modelName].findOne({_id: model_id}, function(err, model){
		if (err) { return end(err, callback); }
		if (!model){ return(null, callback); }
		var index = model.serviceRequests.indexOf(service_request_id);
		if (index === -1){ 
			model.serviceRequests.push(service_request_id);
			model.save(function(err){ end(err, callback); });
		} else {
			end(null, callback);
		}
	});
}

function swapServiceRequest(modelName , service_request_id, old_model_id, new_model_id, callback){
	async.parallel([
		function(cb){
			addServiceRequest(modelName, service_request_id, new_model_id, function(){
				cb();
			});
		},
		function(cb){
			removeServiceRequest(modelName, service_request_id, old_model_id, function(){
				cb();
			});
		},
	], function(err){
		end(err, callback);
	});
}

exports.removeServiceRequest = removeServiceRequest;

exports.addServiceRequest    = addServiceRequest;

exports.swapServiceRequest   = swapServiceRequest;