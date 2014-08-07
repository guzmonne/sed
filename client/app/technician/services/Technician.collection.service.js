'use strict';

angular.module('sedApp')
  .factory('TechnicianCollection',  ['$rootScope', 'Sync', 'TechnicianModel', 'Collection', function($rootScope, Sync, TechnicianModel, Collection){
		var TechnicianCollection = {};
		/*
		** Events
		*/
		$rootScope.$on('technician:update', function(event, model )     { Collection.addModel  (TechnicianCollection, model );  });
		$rootScope.$on('technician:create', function(event, model )     { Collection.addModel  (TechnicianCollection, model );  });
		$rootScope.$on('technician:index' , function(event, models)     { Collection.addModels (TechnicianCollection, models); });
		$rootScope.$on('technician:delete', function(event, data, model){ Collection.remove    (TechnicianCollection, model );  });
		/*
		** Public
		*/  	
		TechnicianCollection.data     = [];
		TechnicianCollection.empty    = TechnicianModel.empty;
		TechnicianCollection.addModel = Collection.addModel;
		TechnicianCollection.delete   = TechnicianModel.delete;
		TechnicianCollection.index    = function(){ 
			return Sync.from('Technician', 'index'); 
		};
		/*
		** Return
		*/
		return TechnicianCollection;
  }]
);