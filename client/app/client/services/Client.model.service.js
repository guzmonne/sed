'use strict';

angular.module('sedApp')
  .factory('ClientModel', ['Sync', function(Sync){
  	var ClientModel = {};
  	/*
  	** Public
  	*/
		ClientModel.defaults = { docType  : 'C.I.' };
		ClientModel.docTypes = ['C.I.', 'R.U.T'];
		ClientModel.empty    = function(){ return _.cloneDeep(ClientModel.defaults); };
		ClientModel.get      = function(id){
			if (!_.isString(id)) { return; }
			return Sync.from('Client', 'show', {id:id});
		};
		ClientModel.create = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Client', 'create', model);
		};
		ClientModel.update = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Client', 'update', model);
		};
		ClientModel.delete = function(model){
			var id; 
			if (_.isUndefined(model)) {return;}
			if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
			if (_.isString(model)){id = model;}
			return Sync.from('Client', 'delete', {id: id});
		};
		ClientModel.show = ClientModel.get;
		/*
		** Return
		*/
		return ClientModel;
	}]
);