'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service_request', {
        url: '/service_request',
        templateUrl: 'app/service_request/service_request.html',
        controller: 'ServiceRequestCtrl',
        data: {
        	login: true
        }
      });
  });