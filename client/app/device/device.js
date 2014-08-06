'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('device', {
        url: '/device',
        template: [
          '<div ng-include="\'components/navbar/navbar.html\'"></div>',
          '<div ui-view></div>',
          '<footer class="footer" ng-include="\'components/footer/footer.html\'"></footer>'
        ].join(''),
      })
			.state('device.index', {
        url: '/index',
        templateUrl: 'app/device/index/device.index.html',
        controller: 'DeviceIndexCtrl',
        resolve: {
          collection: ['DeviceCollection', function(DeviceCollection){
            return DeviceCollection.index();
          }]
        }
      })
      .state('device.new', {
        url: '/new',
        templateUrl: 'app/device/new/device.new.html',
        controller: 'DeviceNewCtrl',
        resolve: {
          model: ['DeviceModel', function(DeviceModel){
            return DeviceModel.empty();
          }]
        }
      })
      .state('device.edit',{
        url: '/:id/edit',
        templateUrl: 'app/device/edit/device.edit.html',
        controller: 'DeviceEditCtrl',
        resolve: {
          model: ['$stateParams', 'DeviceModel', function($stateParams, DeviceModel){
            return DeviceModel.get($stateParams.id);
          }]
        } 
      })
      .state('device.show', {
        url: '/:id',
        templateUrl: 'app/device/show/device.show.html',
        controller: 'DeviceShowCtrl',
        resolve: {
          model: ['$stateParams', 'DeviceModel', function($stateParams, DeviceModel){
            function addDetailsToServiceRequests(device){
              _.forEach(device.serviceRequests, function(model){
                model._device = { _id: model._device, brand: device.brand, model: device.model, description: device.description };
              });
              return device;
            }
            return DeviceModel.get($stateParams.id)
              .then(function(device){
                return addDetailsToServiceRequests(device);
              });
          }]
        }
      });
  });