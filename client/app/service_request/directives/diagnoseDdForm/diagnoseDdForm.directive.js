'use strict';

angular.module('sedApp')
  .directive('diagnoseDdForm', function () {
    return {
      templateUrl: 'app/service_request/directives/diagnoseDdForm/diagnoseDdForm.html',
      scope: {
        model   : '=',
        form    : '=',
        done    : '&',
        disabled: '@',
        show    : '='
      },
      controller: ['$scope', function($scope){
        $scope.button  = false;
        $scope.form    = false;
        $scope.spinner = false;
        $scope.ok = function(){
          $scope.spinner = true;
          $scope.done({diagnose: $scope.model});
        };
      }],
      link: function (scope, element) {
        element.find('dt').click(function(){
          element.find('textarea').focus();
        });
        scope.$watch('form', function(n){
          if(n === true){ scope.spinner = false; }
        });
      }
    };
  });