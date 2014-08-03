'use strict';

angular.module('sedApp')
  .directive('guxOnHover', function () {
    return {
      template: '<span ng-show="show" ng-transclude ng-mouseenter="mouseOverTitle()" ng-mouseleave="mouseLeaveTitle()"></span>',
      transclude: true,
      restrict: 'A',
      controller: [ '$scope', function($scope){
      		$scope.show = false;
	      	$scope.mouseOverTitle  = function(){ $scope.show = true; };
	  			$scope.mouseLeaveTitle = function(){ $scope.show = false; };
	      }
      ],
    };
  });