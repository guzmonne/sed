'use strict';
/*jshint camelcase: false */

angular.module('sedApp')
  .controller('ServiceRequestEditCtrl', function ($scope, $rootScope, ServiceRequestModel, model, clients, devices) {
		// Public
		// -------
		$scope.model   = model;
		$scope.clients = clients;
		$scope.devices = devices;
  });
