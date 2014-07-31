'use strict';

angular.module('sedApp')
  .controller('ServiceRequestNewCtrl', function ($scope, $rootScope, ServiceRequestModel, model, clients, devices) {
		// Events
		// ------
		$rootScope.$on('servicerequest:create', function(){
			$scope.model  = ServiceRequestModel.empty();
		});
		// Private
		// -------
		$scope.model   = model;
		$scope.clients = clients;
		$scope.devices = devices;
  });
