'use strict';

angular.module('sedApp')
  .factory('ClientCollection', ['Sync', function(Sync){
		var ClientCollection = {};
		/*
		** Public
		*/
		ClientCollection.empty = function(){ return []; }
		ClientCollection.index = function(){ return Sync.from('Client', 'index'); };
		/*
		** Return
		*/
		return ClientCollection;
  }]
);
