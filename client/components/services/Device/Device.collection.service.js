'use strict';

function DeviceCollection ($q, Device, DeviceModel, $rootScope){
	var DeviceCollection = {};
	// Event listeners
	$rootScope.$on('device:update', function(event, model){ addModel(model); });
	$rootScope.$on('device:create', function(event, model){ addModel(model); });
	// Private
	// -------
	function sync (method, params){
		if (!_.isString(method)){ return; }
		params = (params) ? params : null;
		var deferred = $q.defer();
		Device[method](params, function(data){
			deferred.resolve(data);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	function findModel(id){
		return _.find(DeviceCollection.data, function(m){
			return m._id === id;
		});
	}
	function pushModel(model){
		DeviceCollection.data.push(model);
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
		if (DeviceCollection.data.length === 0){
			DeviceCollection.data = data;
		}
		_.each(data, addModel);
	};
	// Public
	// ------
	DeviceCollection.data     = [];
	DeviceCollection.empty    = DeviceModel.empty;
	DeviceCollection.delete   = DeviceModel.delete;
	DeviceCollection.addModel = addModel;
	DeviceCollection.index    = function(){
		var deferred = $q.defer();
		Device.index(function(data){
			addModels(data);
			deferred.resolve(data);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return DeviceCollection;
}

DeviceCollection.$inject = ['$q', 'Device', 'DeviceModel', '$rootScope'];
angular.module('sedApp')
  .factory('DeviceCollection', DeviceCollection);
