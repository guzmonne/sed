'use strict';
/*jshint camelcase: false */

angular.module('sedApp')
  .controller('ServiceRequestEditCtrl', function ($scope, $rootScope, ServiceRequestModel, model, clients, devices) {
		// Events
		// ------
		$rootScope.$on('service_request:create', function(){
			$scope.client = null;
  		$scope.device = null;
			$scope.model  = ServiceRequestModel.empty();
		});
		// Public
		// -------
		$scope.model   = model;
		$scope.clients = clients;
		$scope.devices = devices;
		$scope.device  = null;
		$scope.client  = null;
		// Private
		// -------
		function find(collection, id){
			return _.find(collection, function(m){ if(m._id){ return m._id === id; } });
		}
		// Initialize
		// ----------
		$scope.client = find(clients, $scope.model.client_id);
		$scope.device = find(devices, $scope.model.device_id);
  });
