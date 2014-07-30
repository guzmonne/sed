'use strict';

angular.module('sedApp')
  .service('Sync', ['$q', 'Api', function($q, Api){
    this.from = function(endpoint, method, params){
      if (!_.isString(method)){ return; }
      params = (params) ? params : {};
      var deferred = $q.defer();
      Api[endpoint][method](params, function(data){
        deferred.resolve(data);
      }, function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }]
);