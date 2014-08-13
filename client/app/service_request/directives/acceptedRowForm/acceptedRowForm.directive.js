'use strict';

angular.module('sedApp')
  .directive('acceptedRowForm', function () {
		return {
	  	templateUrl: 'app/service_request/directives/acceptedRowForm/acceptedRowForm.html',
	    scope: {
	      model   : '=',
	      done    : '&',
	      disabled: '=',
	      show    : '='
	    },
	    controller: ['$scope', function($scope){
	    	function selected(){
	    		var accepted = $scope.$eval($scope.radioValue);
	    		$scope.done({ accepted: accepted });
	    	}
				$scope.selected   = selected;
				$scope.radioValue = null;
	    }],
	  	link: function(scope, element){
	      function show(){ if (scope.show === true){ element.show(); } else { element.hide(); } }
	      scope.$watch('show', show);
	  	}
		};
  });