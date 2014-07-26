'use strict';

function DeviceModel ($q, Device, $rootScope){
	var DeviceModel = {};
	// Private
	// -------
	function sync (method, params){
		if (!_.isString(method)){ return; }
		params = (params) ? params : {};
		var deferred = $q.defer();
		Device[method](params, function(model){
			$rootScope.$broadcast('device:'+ method, model);
			deferred.resolve(model);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;//
	};
	// Public
	// ------
	DeviceModel.defaults = {
		brand      : null,
		model      : null,
		description: null,
		image      : null,
	};
	DeviceModel.empty    = function(){ return _.cloneDeep(DeviceModel.defaults); }
	DeviceModel.get      = function(id){
		if (!_.isString(id)) { return; }
		return sync('show', {id: id});
	};
	DeviceModel.create = function(model){
		if (!_.isObject(model)){ return; }
		return sync('create', model);
	}
	DeviceModel.update = function(model){
		if (!_.isObject(model)){ return; }
		return sync('update', model);
	};
	DeviceModel.delete = function(model){
		if (_.isUndefined(model)) {return;}
		var id; 
		if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
		if (_.isString(model)){id = model;}
		return sync('delete', {id: id});
	}
	DeviceModel.show = DeviceModel.get;
	return DeviceModel;
}

DeviceModel.$inject = ['$q', 'Device', '$rootScope'];
angular.module('sedApp')
  .factory('DeviceModel', DeviceModel);
