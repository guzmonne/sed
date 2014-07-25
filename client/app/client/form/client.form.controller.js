'use strict';

angular.module('sedApp')
  .controller('ClientFormCtrl', ['$scope', '$stateParams', 'ClientModel', 'Alerts', function ($scope, $stateParams, ClientModel, Alerts) {
  	// Public
  	// ------
		//$scope.model    = ClientModel.empty();
		$scope.docTypes = ClientModel.docTypes;
		$scope.alerts   = [];
		$scope.submit   = function(){
			if ($scope.model._id){
				update();
			} else {
				create();
			} 
		};
		$scope.closeAlert = Alerts.closeAlert;
  	// Private
  	// -------
  	var defaults = ClientModel.empty();
    function errorHandler(error){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ya existe un cliente con este "documento" o se ha producido un error en el servidor'});
    }
    function create(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Cliente creado con exito!'}); 
        $scope.clientNewForm.$setPristine();
        $scope.model = ClientModel.empty();
      };
      ClientModel.create($scope.model).then(success, errorHandler);
    }
    function update(){
      var success = function(data){
        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Cliente actualizado con exito!'});
        $scope.clientNewForm.$setPristine();
      };
      ClientModel.update($scope.model).then(success, errorHandler);
    }
  }]);
