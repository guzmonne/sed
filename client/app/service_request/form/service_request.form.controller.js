'use strict';

angular.module('sedApp')
  .controller('ServiceRequestFormCtrl', ['$scope', '$stateParams', '$rootScope', 'ServiceRequestModel', 'Alerts', function ($scope, $stateParams, $rootScope, ServiceRequestModel, Alerts) {
  	// Public
  	// ------
    $scope.newAccessory = null;
    $scope.datepicker   = {
			openedBoughtAt : false
		}
		$scope.alerts         = [];
		$scope.format         = 'longDate';
	  $scope.maxDate        = new Date();
  	$scope.dateOptions = {
			formatYear : 'yyyy',
			startingDay: 1,
  	};
  	$scope.addAccessory = function($event){
  		$event.preventDefault();
    	$event.stopPropagation();
    	addAccessory();
  	};
  	$scope.editAccessory = function($event, index){
  		$event.preventDefault();
    	$event.stopPropagation();
  		$scope.newAccessory = $scope.model.accessories.splice(index, 1);
  	};
  	$scope.removeAccessory = function($event, index){
  		$event.preventDefault();
    	$event.stopPropagation();
  		$scope.model.accessories.splice(index, 1);
  	};
  	$scope.onSelectClient = function(item){
      $rootScope.$broadcast('service_request:form:client:update', item);
      $scope.model.client_id = item._id;
    };
    $scope.onSelectDevice = function(item){
      $rootScope.$broadcast('service_request:form:device:update', item);
			$scope.model.device_id = item._id;
  	}
  	$scope.openBoughtAt = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.datepicker.openedBoughtAt = true;
  	};
		$scope.submit   = function(){	if ($scope.model._id){ update(); } else { create(); } };
		$scope.closeAlert = Alerts.closeAlert;
  	// Private
  	// -------
  	var defaults = ServiceRequestModel.empty();
    function addAccessory(){
  		if (_.isNull($scope.newAccessory) || $scope.newAccessory === ''){ return; }
      if ($scope.newAccessory === null || $scope.newAccessory === ''){ return; };
  		if (_.find($scope.model.accessories, function(acc){return acc === $scope.newAccessory})){
  			return $scope.newAccessory = null;
  		}
  		$scope.model.accessories.push($scope.newAccessory);
  		$scope.newAccessory = null;
    };
    function errorHandler(error){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ya existe un cliente con este "documento" o se ha producido un error en el servidor'});
    };
    function create(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Orden de Servicio creada con exito!'}); 
        $scope.serviceRequestNewForm.$setPristine();
      };
      addAccessory();
      ServiceRequestModel.create($scope.model).then(success, errorHandler);
    }
    function update(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Orden de Servicio actualizada con exito!'});
        $scope.serviceRequestNewForm.$setPristine();
      };
      addAccessory();
      ServiceRequestModel.update($scope.model).then(success, errorHandler);
    }
  }]);
