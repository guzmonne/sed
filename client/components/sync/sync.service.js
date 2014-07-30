'use strict';

angular.module('sedApp')
  .service('Sync', ['$rootScope', '$q', 'Api', function($rootScope, $q, Api){

    this.from = function(endpoint, method, params){
      var args;
      if (!_.isString(method)){ return; }
      params  = (params)  ? params  : {};
      var deferred = $q.defer();
      function resolved(data){
        var eventName = endpoint.toLowerCase() + ':' + method;
        $rootScope.$broadcast(eventName, data, params);
        deferred.resolve(data);
      }
      function rejected(error){
        deferred.reject(error);
      }
      args   = [resolved, rejected];
      if (method !== 'index'){
        args.unshift(params);
      }
      Api[endpoint][method].apply(this, args);
      return deferred.promise;
    }
  }]
);