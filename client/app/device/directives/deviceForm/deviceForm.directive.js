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
  controller: [ '$scope', '$state', 'Flash', 'DeviceModel', 'Alerts', function($scope, $state, Flash, DeviceModel, Alerts){
    /*
    ** Public
    */
    $scope.alerts     = [];
    $scope.closeAlert = Alerts.closeAlert;
    $scope.submit     = function(){ if ($scope.model._id){ submit('update'); } else { submit('create'); } };
    $scope.submiting  = false;
    /*
    ** Private
    */
    function errorHandler(error){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'El modelo ya existe o ha ocurrido un error en el servidor'});
      if (_.isFunction($scope.error)){ $scope.error(error); }
      $scope.submiting = false;
    }
    function successHandler(data){
      var msg;
      if ($scope.model._id){ 
        msg = 'Equipo actualizado con exito!'; 
      } else { 
        msg = 'Equipo creado con exito!'; 
        Flash.set(msg);
        return $state.go('device.show', {id: data._id});
      }
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
      $scope.deviceForm.$setPristine();
      if (_.isFunction($scope.success)){ $scope.success(data); }
      $scope.submiting = false;
    }
    function submit(method){
      $scope.submiting = true;
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
      if (scroll === true)  { bindScroll(); }
      else if (scroll === false){ unbindScroll(); }
    });
  }
    };
  });