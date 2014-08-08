'use strict';

angular.module('sedApp')
  .factory('Collection', function(){
		/*
		** Private
		*/
		function remove(collection, model){
			if (_.isString(model) || (_.isObject(model) && !_.isUndefined(model.id))){
				model = findModel(model.id);
			}
			var index = collection.data.indexOf(model);
			if (index > -1){ collection.data.splice(index, 1); } 
		}
		function findModel(collection, id){
			return _.find(collection.data, function(m){
				return m._id === id;
			});
		}
		function pushModel(collection, model){
			collection.data.push(model);
		}
		function mergeModels(_model, model){
			if (!_.isObject(_model) || !_.isObject(model)) { return; }
			_.merge(_model, model);
		}
		function addModel(collection, model){
			if (_.isUndefined(model) || _.isUndefined(model._id)){ return; }
			var _model = findModel(collection, model._id);
			if (_model) { mergeModels(_model, model); }
			else        { pushModel(collection, model); }
		}
		function addModels(collection, data){
			if (!_.isArray(data)){ return; } 
			if (collection.data.length === 0){ collection.data = data; }
			_.each(data, function(model){ addModel(collection, model); });
		}
		/*
		** Collection
		*/  	
		var Collection = {
			remove     : remove,
			findModel  : findModel,
			pushModel  : pushModel,
			mergeModels: mergeModels,
			addModel   : addModel,
			addModels  : addModels
		};
		/*
		** Return
		*/
		return Collection;
  }
);

