'use strict';

angular.module('sedApp')
  .controller('ClientIndexCtrl', function ($scope, ClientModel, Alerts, Auth, collection) {
    $scope.collection = collection;
    $scope.alerts = [];
    $scope.tableOpts = {
			sortField    : '_id',
			searchString : null,
			modelsPerPage: 10
    }
    $scope.closeAlerts = Alerts.closeAlerts;
    $scope.isAdmin = Auth.isAdmin;
    $scope.delete = function(model){
    	var success = function(){
    		remove(model);
    		Alerts.pushAlert($scope.alerts, {type: 'info', msg: 'El cliente fue eliminado con exito'});		
    	}
    	var error = function(error){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intetar elminar al cliente'});
    	}
    	ClientModel.delete(model).then(success, error);
    };
    function remove(model){
    	var index = $scope.collection.indexOf(model);
  		if (index > -1){
  			collection.splice(index, 1);
  		}
    };
  });
