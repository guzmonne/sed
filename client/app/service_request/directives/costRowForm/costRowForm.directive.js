'use strict';

angular.module('sedApp')
  .directive('costRowForm', function () {
    return {
      templateUrl: 'app/service_request/directives/costRowForm/costRowForm.html',
      scope: {
      	model: '=',
      	show : '@',
      	form : '=',
      	done : '&',
      },
      controller: ['$scope', function($scope){
      	$scope.ok             = ok;
				$scope.cost           = null;
				$scope.button         = false;
				$scope.spinner        = false;
				$scope.showRow        = showRow;
				$scope.toggleCostForm = toggleCostForm;
      	function showRow(){
      		if ($scope.show){ return $scope.$eval($scope.show); } else { return true; }
      	}
		    function toggleCostForm(){
		      $scope.form = true;
		      if ($scope.model){ $scope.cost = $scope.model; }
		    }
		    function ok(){
		    	$scope.spinner = true;
		    	$scope.done({cost: $scope.cost});
		    }
      }],
      link: function (scope, element) {
      	function handleRow(){
					if (scope.$eval(scope.show)){
	      		element.show();
		      	element.bind('mouseenter', function(){
		      		scope.$apply(function(){ scope.button = true; });
		      	});
		      	element.bind('mouseleave', function(){
		      		scope.$apply(function(){ scope.button = false; });
		      	});
		      	element.find('.btn-warning').click(function(){ element.find('.form-control').focus(); });
	      	} else {
	      		element.hide();
	      		element.unbind();
	      	}
      	}
      	scope.$watch('show', handleRow);
      	scope.$watch('form', function(n){
      		if (n === true){ scope.spinner = false; }
      	});
      }
    };
  });