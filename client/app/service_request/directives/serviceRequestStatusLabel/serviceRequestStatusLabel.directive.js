'use strict';

angular.module('sedApp')
  .directive('serviceRequestStatusLabel', function () {
    return {
      template: [
      	'<span class="label label-default" ng-style="style">{{model}}</span>',
      ].join(''),
      scope : {
      	model: '@serviceRequestStatusLabel'
      },
      link: function (scope) {
				scope.style = {};
				var styles  = {
        	'Pendiente': {
						'background-color': '#9299C7',
						'border-color'    : '#737897'
        	},
        	'Cerrado': {
						'background-color': '#476E4D',
						'border-color'    : '#234729'
        	},
        	'En Reparación' :{
						'background-color': '#FF9F00',
						'border-color'    : '#EB9A13'
        	},
        	'Esperando Aprobación': {
						'background-color': '#FD6E32',
						'border-color'    : '#E7632A'
        	}
        };
        scope.$watch('model', function(status){
        	scope.style = styles[status];
        });
      }
    };
  });