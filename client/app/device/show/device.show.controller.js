'use strict';

angular.module('sedApp')
  .controller('DeviceShowCtrl', function ($scope, model) {
  	$scope.model    = model;
  	$scope.showEdit = false; 
  	$scope.showForm = false;
  	$scope.mouseOverTitle  = function(){ $scope.showEdit = true; };
  	$scope.mouseLeaveTitle = function(){ $scope.showEdit = false; };
  	$scope.hideColumns = ['_device.brand', '_device.model', '_device.description'];
  });
