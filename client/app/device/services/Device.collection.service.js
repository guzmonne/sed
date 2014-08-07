'use strict';

angular.module('sedApp')
  .factory('DeviceCollection', ['$rootScope', 'Sync', 'DeviceModel', 'Collection', function($rootScope, Sync, DeviceModel, Collection){
		var DeviceCollection = {};
		/*
		** Events
		*/
		$rootScope.$on('device:update', function(event, model )     { Collection.addModel  (DeviceCollection, model );  });
		$rootScope.$on('device:create', function(event, model )     { Collection.addModel  (DeviceCollection, model );  });
		$rootScope.$on('device:index' , function(event, models)     { Collection.addModels (DeviceCollection, models); });
		$rootScope.$on('device:delete', function(event, data, model){ Collection.remove    (DeviceCollection, model );  });
		/*
		** Public
		*/  	
		DeviceCollection.data     = [];
		DeviceCollection.empty    = DeviceModel.empty;
		DeviceCollection.addModel = Collection.addModel;
		DeviceCollection.delete   = DeviceModel.delete;
		DeviceCollection.index    = function(){ 
			return Sync.from('Device', 'index'); 
		};
		/*
		** Return
		*/
		return DeviceCollection;
  }]
);

