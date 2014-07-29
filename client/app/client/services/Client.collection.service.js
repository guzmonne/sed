'use strict';

function ClientCollection ($q, Client){
	var ClientCollection = {};
	// Public
	// ------
	ClientCollection.empty = function(){ return []; };
	ClientCollection.index = function(){
		var deferred = $q.defer();
		Client.index(function(data){
			deferred.resolve(data);
		}, function(error){
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return ClientCollection;
}

ClientCollection.$inject = ['$q', 'Client'];
angular.module('sedApp')
  .factory('ClientCollection', ClientCollection);
