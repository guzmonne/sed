'use strict';

angular.module('sedApp')
  .controller('TechnicianIndexCtrl', function ($scope, TechnicianCollection, Alerts, Auth) {
    $scope.collection = TechnicianCollection.data;
    // Alerts
    $scope.alerts = [];
    $scope.closeAlerts = Alerts.closeAlerts;
    // Auth
    $scope.isAdmin = Auth.isAdmin;
    $scope.delete = function(model){
    	var success = function(){
    		remove(model);
    		Alerts.pushAlert($scope.alerts, {type: 'info', msg: 'El Servicio Tecnico fue eliminado con exito'});		
    	};
    	var error = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intetar elminar el Servicio Tecnico'});
    	};
    	TechnicianModel.delete(model).then(success, error);
    };
  });
