'use strict';

angular.module('sedApp')
  .directive('technicianDetailsList', function () {
    return {
      templateUrl: 'app/technician/directives/technicianDetailsList/technicianDetailsList.html',
      restrict: 'EA',
      scope: {
      	model: '=technicianDetailsList'
      }
    };
  });