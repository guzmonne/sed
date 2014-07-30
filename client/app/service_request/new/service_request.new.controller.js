'use strict';

angular.module('sedApp')
  .controller('ServiceRequestNewCtrl', function ($scope, $rootScope, ServiceRequestModel, model, clients, devices) {
		// Events
		// ------
		$rootScope.$on('servicerequest:create', function(event){
			$scope.client = {};
			$scope.device = {};
			$scope.model  = ServiceRequestModel.empty();
		});
		$rootScope.$on('servicerequest:form:client:update', function($event, client){
			$scope.client = client;
		});
		$rootScope.$on('servicerequest:form:device:update', function($event, device){
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
