'use strict';

angular.module('sedApp')
  .directive('technicianForm', function () {
    return {
      templateUrl: 'app/technician/directives/technicianForm/technicianForm.html',
      restrict: 'AE',
      scope: {
				model  : '=',
				success: '&',
				error  : '&',
      },
      controller : ['$scope', '$state', 'Flash', 'TechnicianModel', 'Alerts', function($scope, $state, Flash, TechnicianModel, Alerts){
      	/*
      	** Public
        */
      	$scope.docTypes   = TechnicianModel.docTypes;
      	$scope.alerts     = [];
      	$scope.closeAlert = Alerts.closeAlert; 
      	$scope.submit     = function(){ if ($scope.model._id){ submit('update'); } else { submit('create'); } };
      	/*
      	** Private
      	*/
      	function errorHandler(error){
          Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ya existe un Servicio Tecnico con este nombre o ha ocurrido un error en el servidor'});
          if (_.isFunction($scope.error)){ $scope.error(error); }
        }
        function successHandler(data){
          var msg;
          if ($scope.model._id){ 
            msg = 'Servicio Tecnico actualizado con exito!'; 
          } else { 
            msg = 'Servicio Tecnico creado con exito!'; 
            Flash.set(msg);
            return $state.go('client.show', {id: data._id});
          }
      		Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
      		$scope.technicianForm.$setPristine();
      		if (_.isFunction($scope.success)){ $scope.success(data); }
      	}
      	function submit(method){
      		TechnicianModel[method]($scope.model).then(successHandler, errorHandler);
      	}
      }],
    };
  });