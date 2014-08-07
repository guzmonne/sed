'use strict';

angular.module('sedApp')
  .factory('ClientCollection',  ['$rootScope', 'Sync', 'ClientModel', 'Collection', function($rootScope, Sync, ClientModel, Collection){
		var ClientCollection = {};
		/*
		** Events
		*/
		$rootScope.$on('client:update', function(event, model )     { Collection.addModel  (ClientCollection, model );  });
		$rootScope.$on('client:create', function(event, model )     { Collection.addModel  (ClientCollection, model );  });
		$rootScope.$on('client:index' , function(event, models)     { Collection.addModels (ClientCollection, models); });
		$rootScope.$on('client:delete', function(event, data, model){ Collection.remove    (ClientCollection, model );  });
		/*
		** Public
		*/  	
		ClientCollection.data     = [];
		ClientCollection.empty    = ClientModel.empty;
		ClientCollection.addModel = Collection.addModel;
		ClientCollection.delete   = ClientModel.delete;
		ClientCollection.index    = function(){ 
			return Sync.from('Client', 'index'); 
		};
		/*
		** Return
		*/
		return ClientCollection;
  }]
);