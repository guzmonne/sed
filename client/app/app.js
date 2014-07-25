'use strict';

angular.module('sedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/unauthorize');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else if (response.status === 403) {
          $location.path('/unauthorized');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to main if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams) {
      if (next.authenticate && !Auth.isLoggedIn()) {
        return $location.path('/');
      }
    });
  });