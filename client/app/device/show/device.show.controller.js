'use strict';

angular.module('sedApp')
  .controller('DeviceShowCtrl', function ($scope, $rootScope, Flash, ServiceRequestHandler, model) {
		/*
		** Public
		*/
		$scope.flash                        = Flash;
		$scope.model                        = model;
		$scope.hideColumns                  = ['_device.brand', '_device.model', '_device.description'];
		$scope.serviceRequest               = setServiceRequest();
		$scope.clients                      = ServiceRequestHandler.clients;
		$scope.devices                      = ServiceRequestHandler.devices;
		$scope.newServiceRequest            = false;
		$scope.serviceRequestFormDisabled   = true;
		$scope.selectNewServiceRequestTab   = selectNewServiceRequestTab;
		$scope.deselectNewServiceRequestTab = deselectNewServiceRequestTab;
		/*
		** Events
		*/
		$rootScope.$on('servicerequest:create', function(event, model){
			$scope.serviceRequest = setServiceRequest();
			$scope.model.serviceRequests.push(model);
		});
		/*
		** Private
		*/
		function selectNewServiceRequestTab(){
			$scope.newServiceRequest = true;
			if ($scope.clients.length === 0 || $scope.devices.length === 0){
				ServiceRequestHandler.getCollections(function(){
					$scope.serviceRequestFormDisabled = false;				
					$scope.clients = ServiceRequestHandler.clients;
					$scope.devices = ServiceRequestHandler.devices;
				});
			} else {
				$scope.serviceRequestFormDisabled = false;
				ServiceRequestHandler.getCollections();
			}
		}
		function deselectNewServiceRequestTab(){
			$scope.newServiceRequest = false;
		}
		function setServiceRequest(){
			return ServiceRequestHandler.setServiceRequest('_device', $scope.model);
		}
  });
