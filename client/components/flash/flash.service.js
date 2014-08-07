'use strict';

angular.module('sedApp').factory('Flash', function ($rootScope) {
    /*
    ** Events
    */
    $rootScope.$on('$stateChangeSuccess', function(){
      shift();
    });
    /*
    ** Private
    */
    var queue          = [];
    var currentMessage = '';

    function set(message){
      queue.push(message);
    }
    function get(){
      return currentMessage;
    }
    function shift(){
      currentMessage = queue.shift() || "";
    }
    // Public
    return {
      get  : get,
      set  : set,
      shift: shift,
    };
  });
