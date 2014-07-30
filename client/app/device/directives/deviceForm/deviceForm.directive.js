'use strict';

angular.module('sedApp')
  .directive('deviceForm', function () {
    return {
      templateUrl: 'app/device/directives/deviceForm/deviceForm.html',
      restrict: 'AE',
      scope: {
				model  : '=',
				success: '&',
				error  : '&',
				scroll : '@',
      },
      controller: [ '$scope', 'DeviceModel', 'Alerts', function($scope, DeviceModel, Alerts){
      	/*
      	** Public
      	*/
				$scope.alerts     = [];
				$scope.closeAlert = Alerts.closeAlert;
				$scope.submit     = function(){ if ($scope.model._id){ submit('update'); } else { submit('create'); } };
				/*
				** Private
				*/
      	function errorHandler(error){
      		Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ha ocurrido un error en el servidor'});
      		if (_.isFunction($scope.error)){ $scope.error(error); }
      	}
      	function successHandler(data){
      		var msg;
      		if ($scope.model._id){ 
      			msg = 'Equipo actualizado con exito!'; 
      		} else { 
      			msg = 'Equipo creado con exito!'; 
      			$scope.model = DeviceModel.empty();
      		}
      		Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
      		$scope.deviceForm.$setPristine();
      		if (_.isFunction($scope.success)){ $scope.success(data); }
      	}
      	function submit(method){
      		DeviceModel[method]($scope.model).then(successHandler, errorHandler);
      	}
      }],
      link: function(scope, iElement){
      	var scroll;
      	function bindScroll(){
					scroll = scope.$watch('model', function(){
	      		var target = iElement.find('[name=brand]');
	      		$('body').animate({scrollTop: target.offset().top - 100}, 'slow');
	      		target.focus();
	      	});
      	}
      	function unbindScroll(){
      		if (_.isFunction(scroll)){ 
      			scroll();
      			scroll = null; 
      		}
      	}
      	if (scope.scroll === true || _.isUndefined(scope.scroll)){
	      	bindScroll();
      	}
      	scope.$watch('scroll', function(){
      		if (scroll === true)      { bindScroll(); }
      		else if (scroll === false){ unbindScroll(); }
      	});
      }
    };
  });