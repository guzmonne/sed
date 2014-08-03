'use strict';
/*jshint camelcase: false */

angular.module('sedApp')
  .directive('serviceRequestForm', function ($compile) {
    return {
      templateUrl: 'app/service_request/directives/serviceRequestForm/serviceRequestForm.html',
      restrict: 'AE',
      scope: {
				model  : '=',
				clients: '=',
				devices: '=',
				success: '&',
				error  : '&'
      },
      controller: ['$scope', 'ServiceRequestModel', 'Alerts', function($scope, ServiceRequestModel, Alerts){
      	/*
      	** Private
      	*/
      	function stopEvent(event){
      		event.preventDefault(); event.stopPropagation();
      	}
		    function addAccessory(){
		  		if (_.isNull($scope.newAccessory) || $scope.newAccessory === ''){ return; }
		  		if (_.find($scope.model.accessories, function(acc){return acc === $scope.newAccessory;})){
		  			$scope.newAccessory = null; return;
		  		}
		  		$scope.model.accessories.push($scope.newAccessory);
		  		$scope.newAccessory = null;
		    }
		    function editAccessory(index){
		    	index = (index) ? index : 0; 
		    	$scope.newAccessory = $scope.model.accessories.splice(index, 1);
		    }
		    function errorHandler(){
		      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Se ha producido un error en el servidor'});
		    }
		    function create(){
		      var success = function(){
		        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Orden de Servicio creada con exito!'}); 
		        $scope.serviceRequestForm.$setPristine();
		        $scope.client = {name: null};
		        $scope.device = {model: null};
		      };
		      addAccessory();
		      ServiceRequestModel.create($scope.model).then(success, errorHandler);
		    }
		    function update(){
		      var success = function(){
		        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Orden de Servicio actualizada con exito!'});
		        $scope.serviceRequestForm.$setPristine();
		      };
		      addAccessory();
		      ServiceRequestModel.update($scope.model).then(success, errorHandler);
		    }
      	/*
      	** Public
      	*/
      	// Typeahead
				$scope.client       = {name: null};
				$scope.device       = {model: null};
      	$scope.onSelectClient = function(item){ 
					$scope.model._client = item._id; 
      	};
		    $scope.onSelectDevice = function(item){ 
					$scope.model._device = item._id; 
		    };
				// Accessories
				$scope.newAccessory = null;
      	$scope.addAccessory = function($event){
      		if ($event){stopEvent($event);}
      		addAccessory();
      	};
      	$scope.editAccessory = function($event, index){
      		stopEvent($event);
      		editAccessory(index);
      	};
      	$scope.removeAccessory = function($event, index){
      		stopEvent($event);
      		$scope.model.accessories.splice(index, 1);
      	};
      	// Alert Config
      	$scope.alerts = [];
				$scope.closeAlert = Alerts.closeAlert;
				// DatePicker
				$scope.datepicker   = {
      		openedBoughtAt: false,
      	};
      	$scope.format = 'dd MMMM yyyy';
      	$scope.maxDate = new Date();
      	$scope.dateOptions = {
      		formatYear: 'yyyy',
      		startingDay: 1,
      	};
		  	$scope.openBoughtAt = function($event) {
		    	stopEvent($event);
		    	$scope.datepicker.openedBoughtAt = true;
		  	};
		  	// Form
		  	$scope.submit = function(){	if ($scope.model._id){ update(); } else { create(); } };
      }],
      link: function(scope, iElement){
				function find(collection, id){
					return _.find(collection, function(m){ if(m._id){ return m._id === id; } });
				}
      	if (scope.model._client && scope.model._client._id){
      		scope.client = find(scope.clients, scope.model._client._id);
      	}
      	if (scope.model._device && scope.model._device._id){
      		scope.device = find(scope.devices, scope.model._device._id);
      	}
      	iElement.find('[required]').each(function(){
      		var template = '<span tooltip-placement="bottom" tooltip="Obligatorio" >&nbsp;<i style="color: #e79411;" class="fa fa-asterisk"></i></span>';
      		$(this).parent().parent().find('label').each(function(){
      			$(this).append($compile(template)(scope));
      		});
      	});
      }
    };
  });