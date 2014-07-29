'use strict';

angular.module('sedApp')
  .controller('ServiceRequestNewCtrl', function ($scope, $rootScope, ServiceRequestModel, model, clients, devices) {
		// Events
		// ------
		$rootScope.$on('service_request:create', function(){
			$scope.client = {};
			$scope.device = {};
			$scope.model  = ServiceRequestModel.empty();
		});
		$rootScope.$on('service_request:form:client:update', function($event, client){
			$scope.client = client;
		});
		$rootScope.$on('service_request:form:device:update', function($event, device){
			$scope.device = device;
		});
		// Private
		// -------
		$scope.model   = model;
		$scope.clients = clients;
		$scope.devices = devices;
		$scope.client  = {};
		$scope.device  = {};
  });
