'use strict';

function ServiceRequestCollection ($q, $rootScope, ServiceRequest, ServiceRequestModel, DeviceCollection, ClientCollection){
	var ServiceRequestCollection = {};
	// Event listeners
	$rootScope.$on('device:update', function(event, model){ addModel(model); });
	$rootScope.$on('device:create', function(event, model){ addModel(model); });
	// Private
	// -------
	function sync (method, params){
		if (!_.isString(method)){ return; }
		params = (params) ? params : null;
		var deferred = $q.defer();
		ServiceRequest[method](params, function(data){
			deferred.resolve(data);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	function findModel(id){
		return _.find(ServiceRequestCollection.data, function(m){
			return m._id === id;
		});
	}
	function pushModel(model){
		ServiceRequestCollection.data.push(model);
	}
	function mergeModels(_model, model){
		if (!_.isObject(_model) || !_.isObject(model)) { return; }
		_.merge(_model, model)
	}
	function addModel(model){
		if (_.isUndefined(model) || _.isUndefined(model._id)){ return; }
		var _model = findModel(model._id);
		if (_model) { mergeModels(_model, model); }
		else        { pushModel(model); }
	};
	function addModels(data){
		if (!_.isArray(data)){ return; } 
		if (ServiceRequestCollection.data.length === 0){
			ServiceRequestCollection.data = data;
		}
		_.each(data, addModel);
	};
	// Public
	// ------
	ServiceRequestCollection.data     = [];
	ServiceRequestCollection.empty    = ServiceRequestModel.empty;
	ServiceRequestCollection.delete   = ServiceRequestModel.delete;
	ServiceRequestCollection.addModel = addModel;
	ServiceRequestCollection.index    = function(){
		var deferred = $q.defer();
		ServiceRequest.index(function(data){
			addModels(data);
			deferred.resolve(data);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return ServiceRequestCollection;
}

ServiceRequestCollection.$inject = ['$q', '$rootScope', 'ServiceRequest', 'ServiceRequestModel', 'DeviceCollection', 'ClientCollection'];
angular.module('sedApp')
  .factory('ServiceRequestCollection', ServiceRequestCollection);
