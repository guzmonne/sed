'use strict';

angular.module('sedApp')
  .controller('DeviceIndexCtrl', function ($scope, $rootScope, DeviceCollection, Alerts, Auth) {
    // Public
    $scope.model      = DeviceCollection.empty();
    $scope.collection = DeviceCollection.data;
    $scope.alerts     = [];
    $scope.tableOpts  = {
			sortField    : '_id',
			searchString : null,
			modelsPerPage: 10
    }
    $scope.closeAlerts = Alerts.closeAlerts;
    $scope.isAdmin     = Auth.isAdmin;
    $scope.showForm    = false;
    $scope.toggleForm  = function(item){
      if (item === 'new') {
        $scope.model = DeviceCollection.empty();
        return $scope.showForm = true;
      }
      if (_.isObject(item)) { $scope.model = item; }
      if ($scope.showForm === true) {
        if (item){ return; }
        $scope.model = DeviceCollection.empty();
        $scope.showForm = false;
      } else {
        $scope.showForm = true;
      }
    };
    $scope.delete = function(model){
    	var success = function(){
    		Alerts.pushAlert($scope.alerts, {type: 'info', msg: 'El equipo fue eliminado con exito'});		
    	}
    	var error = function(error){
    		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Hubo un problema al intetar elminar al equipo'});
    	}
    	DeviceCollection.delete(model).then(success, error);
    };
    // Private
    function remove(model){
    	var index = $scope.collection.indexOf(model);
  		if (index > -1){
  			$scope.collection.splice(index, 1);
  		}
    };
  });
