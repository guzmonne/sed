'use strict';

angular.module('sedApp')
  .directive('serviceRequestAccessoriesLabelsH', function () {
    return {
      template: [
				'<span ng-repeat="accessory in model.accessories">',
					'<span class="label label-primary">{{accessory}}</span>',
					'&nbsp;',
				'</span>',
				'<span ng-show="model.accessories.length === 0">Sin accesorios</span>'
      ].join(''),
      scope: {
      	model: '=serviceRequestAccessoriesLabelsH'
      },
      link: function(scope){
      	if (!_.isArray(scope.model.accessories)){ scope.model.accessories = []; }
      }
    };
  });