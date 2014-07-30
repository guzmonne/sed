'use strict';

angular.module('sedApp')
  .factory('ServiceRequestCollection', ['$rootScope', 'Sync', 'ServiceRequestModel', 
  	function($rootScope, Sync, ServiceRequestModel){
  		var ServiceRequestCollection = {};
  		/*
  		** Events
  		*/
			$rootScope.$on('servicerequest:update', function(event, model ){ addModel(model); });
			$rootScope.$on('servicerequest:create', function(event, model ){ addModel(model); });
			$rootScope.$on('servicerequest:index' , function(event, models){ addModels(models); });
			$rootScope.$on('servicerequest:delete', function(event, data, model){ remove(model); });
  		/*
  		** Private 
  		*/
  		function remove(model){
				if (_.isString(model) || (_.isObject(model) && !_.isUndefined(model.id))){
					model = findModel(model.id);
				}
				var index = ServiceRequestCollection.data.indexOf(model);
				if (index > -1){ ServiceRequestCollection.data.splice(index, 1); } 
			}
			function findModel(id){
				return _.find(ServiceRequestCollection.data, function(m){
					return m._id === id;
				});
			}
			function pushModel(model){
				ServiceRequestCollection.data.push(model);
			}
			function mergeModels(_model, model){
				if (!_.isObject(_model) || !_.isObject(model)) { return; }
				_.merge(_model, model);
			}
			function addModel(model){
				if (_.isUndefined(model) || _.isUndefined(model._id)){ return; }
				var _model = findModel(model._id);
				if (_model) { mergeModels(_model, model); }
				else        { pushModel(model); }
			}
			function addModels(data){
				if (!_.isArray(data)){ return; } 
				if (ServiceRequestCollection.data.length === 0){
					ServiceRequestCollection.data = data;
				}
				_.each(data, addModel);
			}
			/*
			** Public
			*/
			ServiceRequestCollection.data     = [];
			ServiceRequestCollection.empty    = ServiceRequestModel.empty;
			ServiceRequestCollection.delete   = ServiceRequestModel.delete;
			ServiceRequestCollection.index    = function(){
				return Sync.from('ServiceRequest', 'index');
			};
			/*
			** Return
			*/
			return ServiceRequestCollection;
  	}
  ]
);