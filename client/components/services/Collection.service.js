'use strict';

function Collection (){
	var Collection = {};

	Collection.findModel = function(id) {
		if (!_.isString(id)){ throw new Error('\'id\' must be a string'); }
		return _.find(this.data, function(m){ return m._id === id; });
	};

	Collection.pushModel = function(model) {
		if (!_.isObject(model)){ throw new Error('\'model\' must be an object'); }
		this.data.push(model);
	};

	Collection.mergeModels = function(_model, model) {
		if (!_.isObject(_model)){ throw new Error('\'_model\' must be an object'); }
		if (!_.isObject(model)){ throw new Error('\'model\' must be an object'); }
		_.merge(_model, model);
	};

	Collection.addModel = function(model) {
		if (!_.isObject(model)){ throw new Error('\'model\' must be an object'); }
		if (_.isUndefined(model._id)){ throw new Error('\'_id\' cant be undefined'); }
		var _model = this.findModel(model._id);
		if (_model){ this.mergeModels(_model, model); }
		else       { this.pushModel(model); } 
	};

	Collection.addModels = function(data) {
		if (!_.isArray(data)){ return; }
		if (this.data.length === 0){ this.data = data; return; }
		_.each(data, Collection.addModel);
	};

	return Collection;
}

//Collection.$inject = [];
angular.module('sedApp')
  .factory('Collection', Collection);
