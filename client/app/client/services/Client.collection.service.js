'use strict';

angular.module('sedApp')
  .factory('ClientCollection', function ClientCollection($q, Client){
  	return {
  		empty : function(){ return []; },
  		index : function(){
				var deferred = $q.defer();
				Client.index(function(data){
					deferred.resolve(data);
				}, function(error){
					deferred.reject(error);
				});
				return deferred.promise;
			};
  	}
  });