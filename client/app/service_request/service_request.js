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
        controller: 'ServiceRequestIndexCtrl',
        resolve: {
          clients: ['ClientCollection', function(ClientCollection){
            return ClientCollection.index();
          }],
          devices: ['DeviceCollection', function(DeviceCollection){
            return DeviceCollection.index();
          }],
          collection: ['clients', 'devices', 'ServiceRequestCollection', function(clients, devices, ServiceRequestCollection){
            return ServiceRequestCollection.index().then(function(services){
              _.each(services, function(service){
                var client = _.find(clients, function(client){return client._id === service.client_id});
                var device = _.find(devices, function(device){return device._id === service.device_id});
                service.clientName        = client.name;
                service.deviceBrand       = device.brand;
                service.deviceModel       = device.model;
                service.deviceDescription = device.description;
              });
              return services;
            });
          }]
        }
      })
      .state('service_request.new', {
        url: '/new',
        templateUrl: 'app/service_request/new/service_request.new.html',
        controller: 'ServiceRequestNewCtrl',
        resolve: {
          model: ['ServiceRequestModel', function(ServiceRequestModel){
            return ServiceRequestModel.empty();
          }],
          clients: ['ClientCollection', function(ClientCollection){
            return ClientCollection.index();
          }],
          devices: ['DeviceCollection', function(DeviceCollection){
            return DeviceCollection.index();
          }]
        }
      })
      .state('service_request.edit',{
        url: '/:id/edit',
        templateUrl: 'app/service_request/edit/service_request.edit.html',
        controller: 'ServiceRequestEditCtrl',
        resolve: {
          model: ['$stateParams', 'ServiceRequestModel', function($stateParams, ServiceRequestModel){
            return ServiceRequestModel.get($stateParams.id);
          }],
          clients: ['ClientCollection', function(ClientCollection){
            return ClientCollection.index();
          }],
          devices: ['DeviceCollection', function(DeviceCollection){
            return DeviceCollection.index();
          }]
        } 
      })
      .state('service_request.show', {
        url: '/:id',
        templateUrl: 'app/service_request/show/service_request.show.html',
        controller: 'ServiceRequestShowCtrl',
        resolve: {
          model: ['$stateParams', 'ServiceRequestModel', function($stateParams, ServiceRequestModel){
            return ServiceRequestModel.show($stateParams.id);
          }]
        }
      });
  });