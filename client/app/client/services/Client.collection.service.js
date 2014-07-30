'use strict';

angular.module('sedApp')
  .factory('ClientCollection', ['$q', 'Sync', function($q, Sync){
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
