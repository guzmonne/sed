'use strict';

angular.module('sedApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('technician', {
        url: '/technician',
        template: [
        	'<div ng-include="\'components/navbar/navbar.html\'"></div>',
        	'<div ui-view></div>',
        	'<footer class="footer" ng-include="\'components/footer/footer.html\'"></footer>'
        ].join(''),
      })
      .state('technician.index', {
        url: '/index',
        templateUrl: 'app/technician/index/technician.index.html',
        controller: 'TechnicianIndexCtrl',
        resolve: {
          collection: ['TechnicianCollection', function(TechnicianCollection){
            return TechnicianCollection.index();
          }]
        }
      })
      .state('technician.new', {
        url: '/new',
        templateUrl: 'app/technician/new/technician.new.html',
        controller: 'TechnicianNewCtrl',
        resolve: {
          model: ['TechnicianModel', function(TechnicianModel){
            return TechnicianModel.empty();
          }]
        }
      })
      .state('technician.edit',{
        url: '/:id/edit',
        templateUrl: 'app/technician/edit/technician.edit.html',
        controller: 'TechnicianEditCtrl',
        resolve: {
          model: ['$stateParams', 'TechnicianModel', function($stateParams, TechnicianModel){
            return TechnicianModel.show($stateParams.id);
          }]
        } 
      })
      .state('technician.show', {
        url: '/:id',
        templateUrl: 'app/technician/show/technician.show.html',
        controller: 'TechnicianShowCtrl',
        resolve: {
          model: ['$stateParams', 'TechnicianModel', function($stateParams, TechnicianModel){
            function addNameToServiceRequests(technician){
              _.forEach(technician.serviceRequests, function(model){
                model._technician = { _id: model._technician, name: technician.name };
              });
              return technician;
            }
            return TechnicianModel.get($stateParams.id)
              .then(function(technician){
                return addNameToServiceRequests(technician);
              });
          }],
        }
      });
  });