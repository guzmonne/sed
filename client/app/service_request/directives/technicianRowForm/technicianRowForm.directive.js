'use strict';

angular.module('sedApp')
  .directive('technicianRowForm', function () {
		return {
      templateUrl: 'app/service_request/directives/technicianRowForm/technicianRowForm.html',
      scope: {
				model     : '=',
				collection: '=',
				form      : '=',
				done      : '&',
				disabled  : '@'
      },
      controller: ['$scope', function($scope){
      	$scope.ok             = ok;
				$scope.technician     = null;
				$scope.button         = false;
				$scope.spinner        = false;
				$scope.toggleCostForm = toggleCostForm;
		    function toggleCostForm(){
		      $scope.form = true;
		      if ($scope.model){ $scope.technician = $scope.model; }
		    }
		    function ok(){
		    	$scope.spinner = true;
		    	$scope.done({technician: $scope.technician});
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
        scope.$watch('disabled', disable);
        scope.$watch('form', function(n){
      		if (n === true){ scope.spinner = false; }
      	});
      }
    };
  });