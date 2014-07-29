'use strict';

angular.module('sedApp')
  .controller('MainCtrl', ['$scope', 'Auth', function ($scope, Auth) {
    $scope.notLoggedIn = function(){
      return !Auth.isLoggedIn();
    };
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.userName = function(){
      return Auth.getCurrentUser().name;
    };
  }]);