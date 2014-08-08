'use strict';
/*jshint camelcase: false */

angular.module('sedApp')
  .directive('serviceRequestForm', function ($compile) {
    return {
      templateUrl: 'app/service_request/directives/serviceRequestForm/serviceRequestForm.html',
      restrict: 'AE',
      scope: {
				model   : '=',
				clients : '=',
				devices : '=',
				success : '&',
				error   : '&',
				disabled: '@'
      },
      controller: ['$scope', '$state', 'Flash', 'ServiceRequestModel', 'Alerts', function($scope, $state, Flash, ServiceRequestModel, Alerts){
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
		    	$scope.success = false;
		    }
		    function create(){
		      var success = function(data){
		        var msg = 'Orden de Servicio creada con exito!';
		        $scope.serviceRequestForm.$setPristine();
		        $scope.setClientAndDevice();
            Flash.set(msg);
		      	$scope.submiting = false;
            return $state.go('service_request.show', {id: data._id});
		      };
		      addAccessory();
		      ServiceRequestModel.create($scope.model).then(success, errorHandler);
		    }
		    function update(){
		      var success = function(){
		        Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Orden de Servicio actualizada con exito!'});
		        $scope.serviceRequestForm.$setPristine();
		      	$scope.success = false;
		      };
		      addAccessory();
		      ServiceRequestModel.update($scope.model).then(success, errorHandler);
		    }
		    function setClientAndDevice(){
      		if (_.isObject($scope.model._client)){
      			$scope.client = $scope.model._client;
      		} else {
      			$scope.client = {name: null};
      		}
      		if (_.isObject($scope.model._device)){
      			$scope.device = $scope.model._device;
      		} else {
      			$scope.device = {model: null};
      		}
      	}
      	/*
      	** Public
      	*/
      	// Typeahead
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
		  	$scope.setClientAndDevice = setClientAndDevice;
		  	$scope.submit = function(){	
		  		$scope.submiting = true;
		  		if ($scope.model._id){ update(); } else { create(); } 
		  	};
      	$scope.submiting = false;
      }],
      link: function(scope, iElement){
				scope.$watch('disabled', function(disabled){
					disabled = scope.$eval(disabled);
					if (disabled === true){
						iElement.find('input').attr('disabled', true);
						iElement.find('button').attr('disabled', true);
					} else {
						iElement.find('input').attr('disabled', false);
						iElement.find('button').attr('disabled', false);
						scope.setClientAndDevice();
					}
				});
      	/*
      	** Initialization
      	*/
      	iElement.find('[required]').each(function(){
      		var template = '<span tooltip-placement="bottom" tooltip="Obligatorio" >&nbsp;<i style="color: #e79411;" class="fa fa-asterisk"></i></span>';
      		$(this).parent().parent().find('label').each(function(){
      			$(this).append($compile(template)(scope));
      		});
      	});
      	//scope.setClientAndDevice()
      }
    };
  });