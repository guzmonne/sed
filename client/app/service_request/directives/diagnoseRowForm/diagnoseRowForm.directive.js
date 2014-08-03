'use strict';

angular.module('sedApp')
  .directive('diagnoseRowForm', function () {
		return {
      templateUrl: 'app/service_request/directives/diagnoseRowForm/diagnoseRowForm.html',
      scope: {
      	model: '=',
      	form : '=',
      	done : '&',
      },
      controller: ['$scope', function($scope){
      	$scope.ok             = ok;
				$scope.diagnose       = null;
				$scope.button         = false;
				$scope.spinner        = false;
				$scope.toggleCostForm = toggleCostForm;
		    function toggleCostForm(){
		      $scope.form = true;
		      if ($scope.model){ $scope.diagnose = $scope.model; }
		    }
		    function ok(){
		    	$scope.spinner = true;
		    	$scope.done({diagnose: $scope.diagnose});
		    }
      }],
      link: function (scope, element) {
      	element.bind('mouseenter', function(){
      		scope.$apply(function(){ scope.button = true; });
      	});
      	element.bind('mouseleave', function(){
      		scope.$apply(function(){ scope.button = false; });
      	});
      	element.find('.btn-warning').click(function(){ element.find('.form-control').focus(); });
      	scope.$watch('form', function(n){
      		if (n === true){ scope.spinner = false; }
      	});
      }
    };
  });