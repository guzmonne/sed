'use strict';

angular.module('sedApp')
  .factory('ClientModel', ['$q', 'Client', function($q, Client){
  	var ClientModel = {};
		// Private
		// -------
		function sync (method, params){
			if (!_.isString(method)){ return; }
			params = (params) ? params : {};
			var deferred = $q.defer();
			Client[method](params, function(data){
				deferred.resolve(data);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};
		// Public
		// ------
		ClientModel.defaults = { docType  : 'C.I.' };
		ClientModel.docTypes = ['C.I.', 'R.U.T'];
		ClientModel.empty    = function(){ return _.cloneDeep(ClientModel.defaults); }
		ClientModel.get      = function(id){
			if (!_.isString(id)) { return; }
			return sync('show', {id: id});
		};
		ClientModel.create = function(model){
			if (!_.isObject(model)){ return; }
			return sync('create', model);
		}
		ClientModel.update = function(model){
			if (!_.isObject(model)){ return; }
			return sync('update', model);
		};
		ClientModel.delete = function(model){
			if (_.isUndefined(model)) {return;}
			var id; 
			if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
			if (_.isString(model)){id = model;}
			return sync('delete', {id: id});
		}
		ClientModel.show = ClientModel.get;
		return ClientModel;
	}]
);