'use strict';

angular.module('sedApp')
  .controller('MainCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.notLoggedIn = function(){
      return !Auth.isLoggedIn();
    };
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.userName   = function(){
      return Auth.getCurrentUser().name;
    }
		$scope.user    = {};
		$scope.errors  = {};
		$scope.pattern = new RegExp(/@/);
		$scope.login   = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.login({
          email   : $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
  }]);