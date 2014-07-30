'use strict';

angular.module('sedApp')
  .factory('Api', ['$resource', function($resource){
    var restRoutes =       {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    };
    return {
      'Client': $resource('/api/clients/:id', {id: '@_id'}, restRoutes),
    }
  }]
);
