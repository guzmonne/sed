'use strict';

angular.module('sedApp')
  .controller('ServiceRequestIndexCtrl', function ($scope, ServiceRequestCollection, Alerts, Auth) {
    $scope.collection = ServiceRequestCollection.data;
    // Alerts
    $scope.alerts = [];
    $scope.closeAlerts = Alerts.closeAlerts;
    // Auth
    $scope.isAdmin = Auth.isAdmin;
    $scope.delete = function(model){
      var success = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'info'  , msg: 'La Orden de Servicio fue eliminada con exito'});		
    	};
    	var error = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intentar elminar la Orden de Servicio'});
    	};
    	ServiceRequestCollection.delete(model).then(success, error);
    };
  });
