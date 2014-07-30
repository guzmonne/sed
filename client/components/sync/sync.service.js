'use strict';

angular.module('sedApp')
  .service('Sync', ['$q', 'Api', function($q, Api){

    this.from = function(endpoint, method, params){
      var args;
      if (!_.isString(method)){ return; }
      var deferred = $q.defer();
      function resolved(data){
        deferred.resolve(data);  
      }
      function rejected(error){
        deferred.reject(error);
      }
      args   = [resolved, rejected];
      params = (params) ? params : {};
      if (method !== 'index'){
        args.unshift(params);
      }
      Api[endpoint][method].apply(this, args);
      return deferred.promise;
    }
  }]
);