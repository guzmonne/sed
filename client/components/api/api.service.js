'use strict';

angular.module('sedApp')
  .factory('Api', ['$resource', function($resource){
    var restRoutes =       {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'patch':   { method: 'PATCH' },
      'destroy': { method: 'DELETE' }
    };
    return {
      'Client'        : $resource('/api/clients/:id'          ,{id: '@_id'}, restRoutes),
      'Device'        : $resource('/api/devices/:id'          ,{id: '@_id'}, restRoutes),
      'ServiceRequest': $resource('/api/service_requests/:id' ,{id: '@_id'}, restRoutes),
      'Technician'    : $resource('/api/technicians/:id'      ,{id: '@_id'}, restRoutes),
      'Log'           : $resource('/api/logs/:id'             ,{id: '@_id'}, restRoutes),
    };
  }]
);
