'use strict';

function Alerts ($timeout){
	var Alerts = {};

	Alerts.closeAlert = function(collection, index) {
		if (!_.isArray(collection)){ return; }
		if (!_.isNumber(index)){ return; }
  	collection.splice(index, 1);
	};
	Alerts.pushAlert = function(collection, alert, duration){
		duration = (_.isNumber(duration)) ? duration : 3000; 
		collection.push(alert);
		if (duration === 0){ return; }
		$timeout(function(){
			var index = collection.indexOf(alert);
			if (index > -1){
				collection.splice(index, 1);
			}
		}, duration);
	};
	return Alerts;
}

Alerts.$inject = ['$timeout'];
angular.module('sedApp')
  .factory('Alerts', Alerts);
