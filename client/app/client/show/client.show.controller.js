'use strict';

angular.module('sedApp')
  .controller('ClientShowCtrl', function ($scope, $rootScope, ClientCollection, DeviceCollection, ServiceRequestModel, model) {
		/*
		** Events
		*/
		$rootScope.$on('servicerequest:create', function(event, model){
			$scope.serviceRequest  = setServiceRequest();
			model._client = {_id: model._client, name: $scope.model.name};
			$scope.model.serviceRequests.push(model);
		});
		/*
		** Public
		*/
		$scope.model                        = model;
		$scope.hideColumns                  = ['_client.name'];
		$scope.serviceRequest               = setServiceRequest();
		$scope.clients                      = [];
		$scope.devices                      = [];
		$scope.newServiceRequest            = false;
		$scope.selectNewServiceRequestTab   = selectNewServiceRequestTab;
		$scope.serviceRequestFormDisabled   = true;
		$scope.deselectNewServiceRequestTab = deselectNewServiceRequestTab;
		/*
		** Private
		*/
		var getCollections = _.once(function(){
			async.parallel([getClients, getDevices], function(err){
				if (err) { console.log(err); }
				$scope.serviceRequestFormDisabled = false; 
			});
		});
		function getClients(callback){
			ClientCollection.index().then(function(data){
				$scope.clients = data;
				if(_.isFunction(callback)){ callback(); }
			});
		}
		function getDevices(callback){
			DeviceCollection.index().then(function(data){
				$scope.devices = data;
				if(_.isFunction(callback)){ callback(); }
			});
		}
		function selectNewServiceRequestTab(){
			$scope.newServiceRequest = true;
			if ($scope.clients.length === 0 || $scope.devices.length === 0){
				getCollections();
			}
		}
		function deselectNewServiceRequestTab(){
			$scope.newServiceRequest = false;
		}
		function setServiceRequest(){
			var result = ServiceRequestModel.empty();
			result._client = model;
			return result;
		}
  });
