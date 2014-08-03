'use strict';

angular.module('sedApp')
  .controller('ServiceRequestIndexCtrl', function ($scope, ServiceRequestModel, Alerts, Auth, collection) {
    $scope.collection = collection;
    $scope.alerts = [];
    $scope.tableOpts = {
			sortField    : '_id',
			searchString : null,
			modelsPerPage: 10
    };
    $scope.closeAlerts = Alerts.closeAlerts;
    $scope.isAdmin     = Auth.isAdmin;
    $scope.columns     = {
      '01': { name: 'ID', show: true }, 
      '02': { name: 'Cliente', show: true },
      '03': { name: 'Marca', show: true },  
      '04': { name: 'Modelo', show: true },  
      '05': { name: 'Descripción', show: true },  
      '06': { name: 'Serie', show: true },  
      '07': { name: 'Estado', show: true },  
      '08': { name: 'Garantía', show: true },  
      '09': { name: 'N° Boleta', show: true },  
      '10': { name: 'Fecha de Compra', show: true },  
      '11': { name: 'Accesorios', show: true },  
      '12': { name: 'Defecto', show: false },  
      '13': { name: 'Prioridad', show: true },  
      '14': { name: 'Tecnico', show: true },  
      '15': { name: 'Presupuesto', show: true },  
      '16': { name: 'Autorizador', show: false },  
      '17': { name: 'Autorizado', show: false },  
      '18': { name: 'Presupuesto Aceptado', show: false },  
      '19': { name: 'Aceptado', show: true },  
      '20': { name: 'Creado', show: true },  
      '21': { name: 'Actualizado', show: true },  
      '22': { name: 'Cerrado', show: true },  
    };
    $scope.delete = function(model){
    	var success = function(){
    		remove(model);
    		Alerts.pushAlert($scope.alerts, {type: 'info', msg: 'La Orden de Servicio fue eliminada con exito'});		
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
