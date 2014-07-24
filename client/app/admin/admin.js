'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        data: {
        	admin: true
        }
      })
      .state('unauthorized', {
      	url: '/unauthorized',
      	templateUrl: 'app/admin/unauthorized.html',
      });
  });