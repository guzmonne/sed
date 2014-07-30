'use strict';

angular.module('sedApp')
  .factory('Sync', ['$q', 'Api', function (Api) {
    /*
    ** Private
    */
    return function(modelName){
      this.fetch = function(method){
        if (!_.isString(method)){ return; }
        params = (params) ? params : {};
        var deferred = $q.defer();
        Api[modelName][method](params, function(data){
          deferred.resolve(data);
        }, function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      }; 
    };
  }]
);
