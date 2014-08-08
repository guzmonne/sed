'use strict';

angular.module('sedApp')
  .filter('objLimitTo', function () {
    return function (obj, limit) {
			var keys = Object.keys(obj);
      if(keys.length < 1){
          return [];
      }
      var ret = {},
          count = 0;
      angular.forEach(keys, function(key){
          if(count >= limit){
              return false;
          }
          ret[key] = obj[key];
          count++;
      });
      return ret;
    };
  });
