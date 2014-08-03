'use strict';

angular.module('sedApp')
  .filter('objectAsArray', function () {
    return function(object) {
      var array = []; 
      for (var item in object) {
        array.push(object[item]);
      }
      return array;
    }
  });
