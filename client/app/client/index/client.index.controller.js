'use strict';

angular.module('sedApp')
  .controller('ClientIndexCtrl', function ($scope, ClientCollection, Alerts, Auth) {
    $scope.collection = ClientCollection.data;
    // Alerts
    $scope.alerts = [];
    $scope.closeAlerts = Alerts.closeAlerts;
    // Auth
    $scope.isAdmin = Auth.isAdmin;
    $scope.delete = function(model){
    	var success = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'info', msg: 'El cliente fue eliminado con exito'});		
    	};
    	var error = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intetar elminar al cliente'});
    	};
    	ClientCollection.delete(model).then(success, error);
    };
  });
