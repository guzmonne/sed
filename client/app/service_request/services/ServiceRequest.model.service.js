'use strict';

function ServiceRequestModel ($q, ServiceRequest, $rootScope){
	var ServiceRequestModel = {};
	// Private
	// -------
	function sync (method, params){
		if (!_.isString(method)){ return; }
		params = (params) ? params : {};
		var deferred = $q.defer();
		ServiceRequest[method](params, function(model){
			$rootScope.$broadcast('service_request:'+ method, model);
			deferred.resolve(model);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;//
	}
	// Public
	// ------
	ServiceRequestModel.defaults = {
		withWarranty  : false,
		accessories   : [],
		priority      : 3,
	};
	ServiceRequestModel.empty    = function(){ return _.cloneDeep(ServiceRequestModel.defaults); };
	ServiceRequestModel.get      = function(id){
		if (!_.isString(id)) { return; }
		return sync('show', {id: id});
	};
	ServiceRequestModel.create = function(model){
		if (!_.isObject(model)){ return; }
		return sync('create', model);
	};
	ServiceRequestModel.update = function(model){
		if (!_.isObject(model)){ return; }
		return sync('update', model);
	};
	ServiceRequestModel.delete = function(model){
		if (_.isUndefined(model)) {return;}
		var id; 
		if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
		if (_.isString(model)){id = model;}
		return sync('delete', {id: id});
	};
	ServiceRequestModel.show = ServiceRequestModel.get;
	return ServiceRequestModel;
}

ServiceRequestModel.$inject = ['$q', 'ServiceRequest', '$rootScope'];
angular.module('sedApp')
  .factory('ServiceRequestModel', ServiceRequestModel);
