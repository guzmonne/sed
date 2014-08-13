var ServiceRequest = require('../api/service_request/service_request.model');
var Device         = require('../api/device/device.model');
var Client         = require('../api/client/client.model');
var Technician     = require('../api/technician/technician.model');
var async          = require('async');

var helper = {
	model            : null,
	device           : null,
	client           : null,
	technician       : null
};

helper.handleError = function (err, callback){
  if (err) { callback(err); }
};

helper.createDevice = function (callback){
  Device.create({
    brand      : "Marca",
    model      : "Modelo",
    description: "Descripición"
  }, function(err, _device){
    helper.handleError(err, callback);
    helper.device = _device;
    callback();
  });
};

helper.createTechnician = function (callback){
  Technician.create({
    name   : 'Test',
    phone  : '6666666',
    address: 'Adress 123',
    email  : 'test@test.com'
  }, function(err, _technician){
    helper.handleError(err, callback);
    helper.technician = _technician;
    callback();
  });
};

helper.createClient = function (callback){
  Client.create({
    name     : "Test",
    docType  : "C.I.",
    docNumber: "123",
    phone    : "123",
    address  : "Test 123",
    email    : "test@example.com"
  }, function(err, _client){
    helper.handleError(err, callback);
    helper.client = _client;
    callback();
  });
}

helper.setup = function (done){
  async.parallel([
    function(cb){
      Client.remove({}, function(err){
        helper.handleError(err, cb);
        helper.client = null;
        helper.createClient(cb);
      });
    },
    function(cb){
      Device.remove({}, function(err){
        helper.handleError(err, cb);
        helper.device = null;
        helper.createDevice(cb);
      });
    },
    function(cb){
      Technician.remove({}, function(err){
        helper.handleError(err, cb);
        helper.technician = null;
        helper.createTechnician(cb)
      });
    },
    function(cb){
      ServiceRequest.remove({}, function(err){
        helper.handleError(err, cb);
        helper.model = null;
        cb(null);
      });
    },
  ], function(err){
    if (err) {console.log(err);}
    helper.model = helper.newServiceRequest();
    done();
  });
}

helper.newServiceRequest = function (){
	return new ServiceRequest({
    _client : helper.client._id,
    _device : helper.device._id,
    accessories : ['ac1', 'ac2'],
    serial: '123',
    defect: 'Test'
  });
}



module.exports = helper;