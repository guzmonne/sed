'use strict';

angular.module('sedApp')
  .factory('ClientModel', function ClientModel($q, Client){
		function sync (method, params){
			if (!_.isString(method)){ return; }
			params = (params) ? params : {};
			var deferred = $q.defer();
			Client[method](params, function(data){
				deferred.resolve(data);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;//
		}
  	return {
  		defaults : { docType  : 'C.I.' },
  		docTypes : ['C.I.', 'R.U.T'],
			empty    : function(){ return _.cloneDeep(this.defaults); },
			get      : function(id){
				if (!_.isString(id)) { return; }
				return sync('show', {id: id});
			},
			create : function(model){
				if (!_.isObject(model)){ return; }
				return sync('create', model);
			},
			update : function(model){
				if (!_.isObject(model)){ return; }
				return sync('update', model);
			},
			delete : function(model){
				if (_.isUndefined(model)) {return;}
				var id; 
				if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
				if (_.isString(model)){id = model;}
				return sync('delete', {id: id});
			},
			show : this.get
  	}
  });