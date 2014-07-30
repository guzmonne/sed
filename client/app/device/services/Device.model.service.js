'use strict';

angular.module('sedApp')
  .factory('DeviceModel', ['Sync', function(Sync){
  	var DeviceModel = {};
  	/*
  	** Public
  	*/
		DeviceModel.defaults = {};
		DeviceModel.empty    = function(){ return _.cloneDeep(DeviceModel.defaults); };
		DeviceModel.get      = function(id){
			if (!_.isString(id)) { return; }
			return Sync.from('Device', 'show', { id: id });
		};
		DeviceModel.create = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Device', 'create', model);
		};
		DeviceModel.update = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Device', 'update', model);
		};
		DeviceModel.delete = function(model){
			var id; 
			if (_.isUndefined(model)) {return;}
			if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
			if (_.isString(model)){id = model;}
			return Sync.from('Device', 'delete', { id: id });
		};
		DeviceModel.show = DeviceModel.get;
		/*
		** Return
		*/
		return DeviceModel;
  }]
);