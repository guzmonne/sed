'use strict';

angular.module('sedApp')
  .directive('clientDetailsList', function () {
    return {
      templateUrl: 'app/client/directives/clientDetailsList/clientDetailsList.html',
      restrict: 'EA',
      scope: {
      	model: '=clientDetailsList'
      }
    };
  });