'use strict';

var should         = require('should');
var ServiceRequest = require('./service_request.model');
var Device         = require('../device/device.model');
var Client         = require('../client/client.model');
var Technician     = require('../technician/technician.model');
var async          = require('async');

var model, device, client, technician;

function handleError(err, callback){
  if (err) { callback(err); }
};

function createDevice(callback){
  Device.create({
    brand      : "Marca",
    model      : "Modelo",
    description: "Descripición"
  }, function(err, _device){
    handleError(err, callback);
    device = _device;
    callback();
  });
}

function createTechnician(callback){
  Technician.create({
    name   : 'Test',
    phone  : '6666666',
    address: 'Adress 123',
    email  : 'test@test.com'
  }, function(err, _technician){
    handleError(err, callback);
    technician = _technician;
    callback();
  });
}

function createClient(callback){
  Client.create({
    name     : "Test",
    docType  : "C.I.",
    docNumber: "123",
    phone    : "123",
    address  : "Test 123",
    email    : "test@example.com"
  }, function(err, _client){
    handleError(err, callback);
    client = _client;
    callback();
  });
}

function setup(done){
  async.parallel([
    function(cb){
      Client.remove({}, function(err){
        handleError(err, cb);
        client = null;
        createClient(cb);
      });
    },
    function(cb){
      Device.remove({}, function(err){
        handleError(err, cb);
        device = null;
        createDevice(cb);
      });
    },
    function(cb){
      Technician.remove({}, function(err){
        handleError(err, cb);
        technician = null;
        createTechnician(cb)
      });
    },
    function(cb){
      ServiceRequest.remove({}, function(err){
        handleError(err, cb);
        model = null;
        cb(null);
      });
    },
  ], function(err){
    if (err) {console.log(err);}
    model = new ServiceRequest({
      _client : client._id,
      _device : device._id,
      accessories : ['ac1', 'ac2'],
      serial: '123',
      defect: 'Test'
    });
    done();
  });
}

describe('Service Request Model', function() {
  before(function(done){
    setup(done);
  });

  beforeEach(function(){
    model = new ServiceRequest({
      _client : client._id,
      _device : device._id,
      accessories : ['ac1', 'ac2'],
      serial: '123',
      defect: 'Test'
    });
  });

  afterEach(function(done){
    ServiceRequest.remove({}, function(){
      model = null;
      done();
    });
  });

  it('should begin with no models', function(done) {
    ServiceRequest.find({}, function(err, models) {
      models.should.have.length(0);
      done();
    });
  });

  it('should begin with 1 client', function(done){
    Client.find({}, function(err, clients){
      clients.should.have.length(1);
      done();
    });
  });

  it('should begin with 1 device', function(done){
    Device.find({}, function(err, devices){
      devices.should.have.length(1);
      done();
    });
  });

  it('should pass if everything is ok', function(done){
    model.save(function(err, result){
      (err === null).should.be.true;
      done();
    });
  });

  it('should fail if client does not exist', function(done){
    model._client = 1;
    model.save(function(err){
      should.exist(err);
      done();
    });
  });

  it('should fail if device does not exist', function(done){
    model._device = 1;
    model.save(function(err){
      should.exist(err);
      done();
    });
  });

  it('should create an ID attribute after save', function(done){
    model.save(function(err, result){
      result.id.should.be.a.Number;
      done();
    });
  });

  it('should set the "costAcceptedAt" date if "costAccepted" is true', function(done){
    model.costAccepted = true;
    model.save(function(err, result){
      (new Date(result.costAcceptedAt)).should.be.a.Date;
      done();
    }); 
  });
 
  it('should have a createdAt date', function(done){
    model.save(function(err, result){
      should.exist(result.createdAt);
      var date = new Date(result.createdAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });

  it('should have a updatedAt date', function(done){
    model.save(function(err, result){
      should.exist(result.updatedAt);
      var date = new Date(result.updatedAt);
      date.should.be.instanceOf(Date);
      done();
    });
  });

  describe('costAccepted dates', function(){
    it('should set the costAcceptedAt date if costAccepted is true', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        model.costAcceptedAt.should.be.ok
        done();
      });
    });
    it('should set the costNotAcceptedAt date to null if costAccepted is true', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        (model.costNotAcceptedAt === undefined || model.costAcceptedAt === null).should.be.true;
        done();
      });
    });
    it('should set the costAcceptedAt date to null if costAccepted is false', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        (model.costAcceptedAt === undefined || model.costAcceptedAt === null).should.be.true;
        done();
      });
    });
    it('should set the costNotAcceptedAt date if costAccepted is false', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        model.costNotAcceptedAt.should.be.ok;
        done();
      });
    });
    it('should set the costNotAcceptedAt date to null if costAccepted is null', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        model.costAccepted = null;
        model.save(function(err){
          (model.costNotAcceptedAt === undefined || model.costAcceptedAt === null).should.be.true;
          done();
        });
      });
    });
    it('should set the costAcceptedAt date to null if costAccepted is null', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        model.costAccepted = null;
        model.save(function(err){
          (model.costAcceptedAt === undefined || model.costAcceptedAt === null).should.be.true;
          done();
        });
      });
    });
  });

  describe('Status cycle', function(){
    it('should have a "Pendiente" status if the service_request is new', function(done){
      model.save(function(err, model){
        handleError(err, done);
        model.status.should.equal('Pendiente');
        done();
      });
    });

    it('should change from "Pendiente" to "En Reparación" if model has warranty and a technician is assigned', function(done){
      model.withWarranty = true;
      model._technician = technician._id;
      model.save(function(err){
        handleError(err, done);
        model.status.should.equal('En Reparación');
        done();
      });
    });
    
    it('should change from "Pendiente" to "Esperando Presupuesto" if model does not has warranty and a technician is assigned', function(done){
      model.withWarranty = false;
      model._technician = technician._id;
      model.save(function(err){
        handleError(err, done);
        model.status.should.equal('Esperando Presupuesto');
        done();
      });
    });

    it('should change from "Esperando Presupuesto" to "Esperando Aprobación" if it does not has warranty, a technician is assigned and a cost is set', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.save(function(err){
        handleError(err);
        model.status.should.equal('Esperando Aprobación');
        done();
      });
    });

    // costAccepted === true
    it('should change from "Esperando Aprobación" to "En Reparación" if it does not has warranty, a technician is assigned, a cost is set, and costAccepted is true', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        model.status.should.equal('En Reparación');
        done();
      });
    });
    it('should change from "No Aceptado", to "En Reparación" if it  does not has warranty, a technician is assigned, a cost is set, and costAccepted is true', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        model.costAccepted = true;
        model.save(function(err){
          handleError(err);
          model.status.should.equal('En Reparación');
          done();
        });
      });
    });
    // costAccepted === false
    it('should change from "Esperando Aprobación" to "No Aceptado" if it does not has warranty, a technician is assigned, a cost is set, and costAccepted is false', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        model.status.should.equal('No Aceptado');
        done();
      });
    });
    it('should change from "En Reparación", to "No Aceptado" if it  does not has warranty, a technician is assigned, a cost is set, and costAccepted is false', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        model.costAccepted = false
        model.save(function(err){
          handleError(err);
          model.status.should.equal('No Aceptado');
          done();
        });
      });
    });
    // costAccepted === null
    it('should remain at "Esperando Aprobación" if it does not has warranty, a technician is assigned, a cost is set, and costAccepted is null', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.save(function(err){
        model.costAccepted = null;
        handleError(err);
        model.save(function(err){
          model.status.should.equal('Esperando Aprobación');
          done();
        });
      });
    });
    it('should change from "En Reparación", to "Esperando Aprobación" if it  does not has warranty, a technician is assigned, a cost is set, and costAccepted is null', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.save(function(err){
        handleError(err);
        model.costAccepted = null
        model.save(function(err){
          handleError(err);
          model.status.should.equal('Esperando Aprobación');
          done();
        });
      });
    });
    it('should change from "No Aceptado", to "Esperando Aprobación" if it  does not has warranty, a technician is assigned, a cost is set, and costAccepted is null', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = false;
      model.save(function(err){
        handleError(err);
        model.costAccepted = null
        model.save(function(err){
          handleError(err);
          model.status.should.equal('Esperando Aprobación');
          done();
        });
      });
    });

    it('should change from "En Reparación" to "Reparado" if it does not has warranty, a technician is assigned, a cost is set, costAccepted is true, and a solution is defined', function(done){
      model.withWarranty = false;
      model._technician  = technician._id;
      model.cost         = 100;
      model.costAccepted = true;
      model.solution     = 'This is a solution'
      model.save(function(err){
        handleError(err);
        model.status.should.equal('Reparado');
        done();
      });
    });

    it('should change from "En Reparación" to "Reparado" if it has warranty, a technician is assigned, and a solution is defined', function(done){
      model.withWarranty = true;
      model._technician  = technician._id;
      model.solution     = 'This is a solution'
      model.save(function(err){
        handleError(err);
        model.status.should.equal('Reparado');
        done();
      });
    })

    it('should change from any status to "Cerrado" if a "closedAt" date is passed', function(done){
      model.closedAt = new Date();
      model.save(function(err){
        handleError(err);
        model.status.should.equal('Cerrado');
        done();
      });
    });

    it('should store the previous status in "previousStatus" when setting the status to "Cerrado"', function(done){
      model.closedAt = new Date();
      model.save(function(err){
        handleError(err);
        model.previousStatus.should.equal('Pendiente');
        done();
      });
    });

    it('should revert back to "previousState" if the status is "Cerrado" and a "closedAt" is passed as null', function(done){
      model.closedAt = new Date();
      model.save(function(err){
        handleError(err);
        model.closedAt = null;
        model.save(function(err){
          handleError(err);
          model.status.should.equal('Pendiente');
          (model.previousStatus === null).should.be.true;
          done();
        });
      });
    });
  });
});