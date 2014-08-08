'use strict';
/* global async */

angular.module('sedApp')
  .service('ServiceRequestHandler', function ServiceRequestHandler(ClientCollection, DeviceCollection, ServiceRequestModel) {
    /*
    ** Service
    */
    var self = this;
    /*
    ** Private
    */
	function getClients(callback){
		ClientCollection.index().then(function(data){
            if(_.isFunction(callback)){ callback(null, data); }
        });
    }
    function getDevices(callback){
        DeviceCollection.index().then(function(data){
            if(_.isFunction(callback)){ callback(null, data); }
		});
	}
    /*
    ** Public Variables
    */
    self.clients = ClientCollection.data;
    self.devices = DeviceCollection.data;
    /*
    ** Public Functions
    */
    self.getCollections = _.throttle(function(done){
		async.parallel([getClients, getDevices], function(err, results){
			if (err) { console.log(err); }
            self.clients = results[0];
            self.devices = results[1];
            if (_.isFunction(done)){done();}
		});
    }, 2000, { 'trailing': false });
    self.setServiceRequest = function(attribute, model){
    	var empty = ServiceRequestModel.empty();
    	empty[attribute] = model;
    	return empty;
    };
  });
