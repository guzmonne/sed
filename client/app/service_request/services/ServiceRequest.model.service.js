'use strict';

angular.module('sedApp')
  .factory('ServiceRequestModel', ['Sync', function(Sync){
		var ServiceRequestModel = {};
  	/*
  	** Public
  	*/
		ServiceRequestModel.defaults = {
			withWarranty  : false,
			accessories   : [],
			priority      : 3,
		};
		ServiceRequestModel.empty    = function(){ return _.cloneDeep(ServiceRequestModel.defaults); };
		ServiceRequestModel.get      = function(id){
			if (!_.isString(id)) { throw new Error('Wrong arguments on "get"');; }
			return Sync.from('ServiceRequest', 'show', {id: id});
		};
		ServiceRequestModel.create = function(model){
			if (!_.isObject(model)){ throw new Error('Wrong arguments on "create"');; }
			return Sync.from('ServiceRequest', 'create', model);
		};
		ServiceRequestModel.update = function(model){
			if (!_.isObject(model)){ throw new Error('Wrong arguments on "update"');; }
			return Sync.from('ServiceRequest', 'update', model);
		};
		ServiceRequestModel.delete = function(model){
			var id; 
			if (_.isUndefined(model)) {throw new Error('Wrong arguments on "delete"');;}
			if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
			if (_.isString(model)){id = model;}
			return Sync.from('ServiceRequest', 'delete', {id: id});
		};
		ServiceRequestModel.patch = function(id, obj){
			if (!_.isString(id) && !_.isObject(obj)){ throw new Error('Wrong arguments on "patch"'); }
			obj = _.merge(obj, {_id: id});
			return Sync.from('ServiceRequest', 'patch', obj);
		}
		ServiceRequestModel.show = ServiceRequestModel.get;
  	/*
  	** Return
  	*/
		return ServiceRequestModel;
  }]
);