'use strict';

angular.module('sedApp')
  .factory('ServiceRequest', ['$resource', function ($resource) {
    // Public API here
    return $resource('/api/service_requests/:id', {id: '@_id'}, {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    });
  }]);
