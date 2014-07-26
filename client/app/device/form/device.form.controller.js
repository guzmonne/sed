'use strict';

angular.module('sedApp')
  .controller('DeviceFormCtrl', ['$scope', '$stateParams', 'DeviceModel', 'Alerts', function ($scope, $stateParams, DeviceModel, Alerts) {
  	// Public
  	// ------
		$scope.alerts   = [];
		$scope.submit   = function(){ if ($scope.model._id){ update(); } else { create(); } };
		$scope.closeAlert = Alerts.closeAlert;
  	// Private
  	// -------
  	var defaults = DeviceModel.empty();
    function errorHandler(error){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ya existe un equipo con este "modelo" o se ha producido un error en el servidor'});
    }
    function create(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Equipo creado con exito!'}); 
        $scope.deviceNewForm.$setPristine();
        //$scope.model = DeviceModel.empty();
      };
      DeviceModel.create($scope.model).then(success, errorHandler);
    }
    function update(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Equipo actualizado con exito!'});
        $scope.deviceNewForm.$setPristine();
      };
      DeviceModel.update($scope.model).then(success, errorHandler);
    }
  }]);
