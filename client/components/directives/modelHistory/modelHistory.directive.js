'use strict';

angular.module('sedApp')
  .directive('modelHistory', function () {
    return {
      templateUrl: 'components/directives/modelHistory/modelHistory.html',
     	scope: {
     		model : '=modelHistory',
     	},
      controller: ['$scope', 'Api', function($scope, Api){
        	/*
      	** Public
      	*/
				$scope.fetching = false;
				$scope.fetch    = fetch;
				$scope.data     = [];
      	/*
      	** Private
      	*/
      	function fetch(){
      		console.log('fetch called');
      		$scope.fetching = true;
      		Api['Log'].query({col: 'service_request', doc: $scope.model._id}, function(data){
      			$scope.data     = data;
      			$scope.fetching = false;
      		}, function(err){
      			console.log(err);
      		});
      	}
      }],
    };
  });