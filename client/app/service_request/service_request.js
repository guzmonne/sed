'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service_request', {
        url: '/service_request',
        template: [
          '<div ng-include="'+"'components/navbar/navbar.html'"+'"></div>',
          '<div ui-view></div>',
          '<footer class="footer" ng-include="'+"'components/footer/footer.html'"+'"></footer>'
        ].join(''),
      })
      .state('service_request.index', {
        url: '/index',
        templateUrl: 'app/service_request/index/service_request.index.html',
        controller: 'ClientIndexCtrl',
        resolve: {
          collection: function(ClientCollection){
            return ClientCollection.index();
          }
        }
      })
      .state('service_request.new', {
        url: '/new',
        templateUrl: 'app/service_request/new/service_request.new.html',
        controller: 'ClientNewCtrl',
        resolve: {
          model: function(ClientModel){
            return ClientModel.empty();
          }
        }
      })
      .state('service_request.edit',{
        url: '/:id/edit',
        templateUrl: 'app/service_request/edit/service_request.edit.html',
        controller: 'ClientEditCtrl',
        resolve: {
          model: function($stateParams, ClientModel){
            return ClientModel.get($stateParams.id);
          }
        } 
      })
      .state('service_request.show', {
        url: '/:id',
        templateUrl: 'app/service_request/show/service_request.show.html',
        controller: 'ClientShowCtrl',
        resolve: {
          model: function($stateParams, ClientModel){
            return ClientModel.show($stateParams.id);
          }
        }
      });
  });