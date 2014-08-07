'use strict';

angular.module('sedApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {
        title: 'Clientes',
        link: '/client/index'
      },
      {
        title: 'Equipos',
        link: '/device/index'
      },
      {
        title: 'Ordenes de Servicio',
        link: '/service_request/index'
      },
      {
        title: 'Servicio Tecnico',
        link: '/technician/index'
      }
    ];

    $scope.isCollapsed    = true;
    $scope.isLoggedIn     = Auth.isLoggedIn;
    $scope.isAdmin        = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      route = route.split(/(\/[a-z_\-\.0-9]+)/g)[1];
      return ($location.path().search(route) > -1);
    };
  });