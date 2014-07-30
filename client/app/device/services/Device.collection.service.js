'use strict';

angular.module('sedApp')
  .factory('DeviceCollection', ['$rootScope', 'Sync', 'DeviceModel', function($rootScope, Sync, DeviceModel){
		var DeviceCollection = {};
		/*
		** Events
		*/
		$rootScope.$on('device:update', function(event, model ){ addModel(model); });
		$rootScope.$on('device:create', function(event, model ){ addModel(model); });
		$rootScope.$on('device:index' , function(event, models){ addModels(models); });
		$rootScope.$on('device:delete', function(event, data, model){ remove(model); });
		/*
		** Private
		*/
		function remove(model){
			if (_.isString(model) || (_.isObject(model) && !_.isUndefined(model.id))){
				model = findModel(model.id);
			}
			var index = DeviceCollection.data.indexOf(model);
			if (index > -1){ DeviceCollection.data.splice(index, 1); } 
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
			if (DeviceCollection.data.length === 0){ DeviceCollection.data = data; }
			_.each(data, addModel);
		};
		/*
		** Public
		*/  	
		DeviceCollection.data     = [];
		DeviceCollection.empty    = DeviceModel.empty;
		DeviceCollection.addModel = addModel;
		DeviceCollection.delete   = DeviceModel.delete;
		DeviceCollection.index    = function(){ 
			return Sync.from('Device', 'index'); 
		};
		/*
		** Return
		*/
		return DeviceCollection;
  }]
);

