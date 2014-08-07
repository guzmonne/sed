'use strict';

angular.module('sedApp')
  .directive('diagnoseRowForm', function () {
		return {
      templateUrl: 'app/service_request/directives/diagnoseRowForm/diagnoseRowForm.html',
      scope: {
        model   : '=',
        form    : '=',
        done    : '&',
        disabled: '@',
        show    : '='
      },
      controller: ['$scope', function($scope){
      	$scope.ok             = ok;
				$scope.diagnose       = null;
				$scope.button         = false;
				$scope.spinner        = false;
				$scope.toggleForm = toggleForm;
		    function toggleForm(){
		      $scope.form = true;
		      if ($scope.model){ $scope.diagnose = $scope.model; }
		    }
		    function ok(){
		    	$scope.spinner = true;
		    	$scope.done({diagnose: $scope.diagnose});
		    }
      }],
      link: function (scope, element) {
      	function bind(){
          element.bind('mouseenter', function(){
            scope.$apply(function(){ scope.button = true; });
          });
          element.bind('mouseleave', function(){
            scope.$apply(function(){ scope.button = false; });
          });
          element.find('.btn-warning').click(function(){ element.find('.form-control').focus(); });  
        }
        function disable(){
          var status = scope.$eval(scope.disabled);
          if (status === true){
            element.unbind();
          } else {
            bind();
          }
        }
        function show(){
          if (scope.show === true){
            element.show();
          } else {
            element.hide();
          }
        }
        scope.$watch('show', show);
        scope.$watch('disabled', disable);
        scope.$watch('form', function(n){
      		if (n === true){ scope.spinner = false; }
      	});
      }
    };
  });