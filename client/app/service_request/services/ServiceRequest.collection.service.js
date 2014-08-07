'use strict';

angular.module('sedApp')
  .factory('ServiceRequestCollection', ['$rootScope', 'Sync', 'ServiceRequestModel', 'Collection', function($rootScope, Sync, ServiceRequestModel, Collection){
		var ServiceRequestCollection = {};
		/*
		** Events
		*/
		$rootScope.$on('servicerequest:update', function(event, model )     { Collection.addModel  (ServiceRequestCollection, model );  });
		$rootScope.$on('servicerequest:create', function(event, model )     { Collection.addModel  (ServiceRequestCollection, model );  });
		$rootScope.$on('servicerequest:index' , function(event, models)     { Collection.addModels (ServiceRequestCollection, models); });
		$rootScope.$on('servicerequest:delete', function(event, data, model){ Collection.remove    (ServiceRequestCollection, model );  });
		/*
		** Public
		*/  	
		ServiceRequestCollection.data     = [];
		ServiceRequestCollection.empty    = ServiceRequestModel.empty;
		ServiceRequestCollection.addModel = Collection.addModel;
		ServiceRequestCollection.delete   = ServiceRequestModel.delete;
		ServiceRequestCollection.index    = function(){ 
			return Sync.from('ServiceRequest', 'index'); 
		};
		/*
		** Return
		*/
		return ServiceRequestCollection;
  }]
);