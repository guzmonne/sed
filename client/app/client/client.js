'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('client', {
        url: '/client',
        template: [
        	'<div ng-include="'+"'components/navbar/navbar.html'"+'"></div>',
        	'<div ui-view></div>',
        	'<footer class="footer" ng-include="'+"'components/footer/footer.html'"+'"></footer>'
        ].join(''),
      })
      .state('client.index', {
        url: '/index',
        templateUrl: 'app/client/index/client.index.html',
        controller: 'ClientIndexCtrl',
        resolve: {
          collection: ['ClientCollection', function(ClientCollection){
            return ClientCollection.index();
          }]
        }
      })
      .state('client.new', {
        url: '/new',
        templateUrl: 'app/client/new/client.new.html',
        controller: 'ClientNewCtrl',
        resolve: {
          model: ['ClientModel', function(ClientModel){
            return ClientModel.empty();
          }]
        }
      })
      .state('client.edit',{
        url: '/:id/edit',
        templateUrl: 'app/client/edit/client.edit.html',
        controller: 'ClientEditCtrl',
        resolve: {
          model: ['$stateParams', 'ClientModel', function($stateParams, ClientModel){
            return ClientModel.get($stateParams.id);
          }]
        } 
      })
      .state('client.show', {
        url: '/:id',
        templateUrl: 'app/client/show/client.show.html',
        controller: 'ClientShowCtrl',
        resolve: {
          model: ['$stateParams', 'ClientModel', function($stateParams, ClientModel){
            return ClientModel.show($stateParams.id);
          }]
        }
      });
  });