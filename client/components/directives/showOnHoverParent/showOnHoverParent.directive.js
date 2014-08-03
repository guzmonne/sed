'use strict';

angular.module('sedApp')
  .directive('showOnHoverParent', function () {
    return {
      link: function (scope, element) {
        element.parent().bind('mouseenter', function(){
        	element.show();
        });
        element.parent.bind('mouseleave', function(){
        	element.hide();
        });
      }
    };
  });