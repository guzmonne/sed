'use strict';

angular.module('sedApp')
  .controller('ServiceRequestIndexCtrl', function ($scope, ServiceRequestModel, Alerts, Auth, collection) {
    $scope.collection = collection;
    $scope.alerts = [];
    $scope.closeAlerts = Alerts.closeAlerts;
    $scope.delete = function(model){
      var success = function(){
    		remove(model);
    		Alerts.pushAlert($scope.alerts, {type: 'info'  , msg: 'La Orden de Servicio fue eliminada con exito'});		
    	};
    	var error = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intentar elminar la Orden de Servicio'});
    	};
    	ServiceRequestModel.delete(model).then(success, error);
    };
    function remove(model){
    	var index = $scope.collection.indexOf(model);
  		if (index > -1){
  			$scope.collection.splice(index, 1);
  		}
    }
  });
