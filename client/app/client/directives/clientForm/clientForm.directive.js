'use strict';

angular.module('sedApp')
  .directive('clientForm', function () {
    return {
      templateUrl: 'app/client/directives/clientForm/clientForm.html',
      restrict: 'AE',
      scope: {
				model  : '=',
				success: '&',
				error  : '&',
      },
      controller : ['$scope', '$state', 'Flash', 'ClientModel', 'Alerts', function($scope, $state, Flash, ClientModel, Alerts){
      	/*
      	** Public
        */
      	$scope.docTypes   = ClientModel.docTypes;
      	$scope.alerts     = [];
      	$scope.closeAlert = Alerts.closeAlert; 
      	$scope.submit     = function(){ if ($scope.model._id){ submit('update'); } else { submit('create'); } };
      	/*
      	** Private
      	*/
      	function errorHandler(error){
          Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ya existe un cliente con este documento o ha ocurrido un error en el servidor'});
          if (_.isFunction($scope.error)){ $scope.error(error); }
        }
        function successHandler(data){
          var msg;
          if ($scope.model._id){ 
            msg = 'Cliente actualizado con exito!'; 
          } else { 
            msg = 'Cliente creado con exito!';
            Flash.set(msg);
            return $state.go('client.show', {id: data._id});
          }
      		Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
      		$scope.clientForm.$setPristine();
      		if (_.isFunction($scope.success)){ $scope.success(data); }
      	}
      	function submit(method){
      		ClientModel[method]($scope.model).then(successHandler, errorHandler);
      	}
      }],
    };
  });