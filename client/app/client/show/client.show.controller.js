'use strict';

angular.module('sedApp')
  .controller('ClientShowCtrl', function ($scope, model) {
  	$scope.model    = model;
  	$scope.showEdit = false; 
  	$scope.mouseOverTitle  = function(){ $scope.showEdit = true; }
  	$scope.mouseLeaveTitle = function(){ $scope.showEdit = false; }
  });
