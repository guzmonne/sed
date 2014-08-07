'use strict';

var mongoose = require('mongoose'),
		helper   = require('../../utils/model.helper'),
		_        = require('lodash'),
    autoInc  = require('mongoose-auto-increment'),
    Schema   = mongoose.Schema;

var ServiceRequestSchema = new Schema({
	'_client': {
		type    : Schema.Types.ObjectId,
		ref     : 'Client',
		required: true
	},
	'_device': {
		type    : Schema.Types.ObjectId,
		ref     : 'Device',
		required: true
	},
	'serial': String,
	'status': {
		type   : String,
		default: 'Pendiente'
	},
	'previousStatus': String,
	'withWarranty'  : Boolean,
	'invoiceNumber' : String,
	'boughtAt'      : Date,
	'accessories'   : [String],
	'defect'        : String,
	'diagnose'      : String,
	'solution'      : String,
	'repairedAt'    : Date,
	'priority'      : Number,
	'_technician'    : {
		type: Schema.Types.ObjectId,
		ref : 'Technician'
	},
	'cost'          : Number,
	'authorizedBy'  : String,
	'authorizedAt'  : Date,
	'costAccepted'  : Boolean,
	'costAcceptedAt': Date,
	'createdAt'     : Date,
	'updatedAt'     : Date,
	'closedAt'      : Date,
	'createdBy'     : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	'updatedBy'     : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	}
});

ServiceRequestSchema.plugin(autoInc.plugin, { model: 'ServiceRequest', field: 'id' });

// Set timestamps
ServiceRequestSchema.pre('save', helper.addTimestamps);

// should change from 'Pendiente' to 'En Reparación' if model has warranty and a technician is assigned
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'En Reparación'){ return next(); }
	if (this.withWarranty === true && this._technician && this.status === 'Pendiente'){
		this.status = 'En Reparación';
	}
	next();
});

// should change from 'Pendiente' to 'Esperando Presupuesto' if model does not has warranty and a technician is assigned
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Esperando Presupuesto'){ return next(); }
	if (this.status === 'Pendiente' && this.withWarranty === false && this._technician){
		this.status = 'Esperando Presupuesto';
	}
	next();
});

// should change from "Esperando Presupuesto" to "Esperando Aprobación" if it does not has warranty, a technician is assigned and a cost is set
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Esperando Aprobación'){ return next(); }
	if (this.status === 'Esperando Presupuesto' && this.withWarranty === false && this._technician && this.cost){
		this.status = 'Esperando Aprobación';
	}
	next();
});

// should change from "Esperando Presupuesto" to "Esperando Aprobación" if it does not has warranty, a technician is assigned and a diagnose is set
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Esperando Aprobación'){ return next(); }
	if (this.status === 'Esperando Presupuesto' && this.withWarranty === false && this._technician && this.diagnose){
		this.status = 'Esperando Aprobación';
	}
	next();
});

// should change from "Esperando Aprobación" to "En Reparación" if it does not has warranty, a technician is assigned, a cost is set, and costAccepted is true
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'En Reparación'){ return next(); }
	if (this.status === 'Esperando Aprobación' && this.withWarranty === false && this._technician && this.cost && this.costAccepted === true){
		this.status = 'En Reparación';
	}
	next();
});

// should change from "Esperando Aprobación" to "En Reparación" if it does not has warranty, a technician is assigned, a diagnose is set, and costAccepted is true
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'En Reparación'){ return next(); }
	if (this.status === 'Esperando Aprobación' && this.withWarranty === false && this._technician && this.diagnose && this.costAccepted === true){
		this.status = 'En Reparación';
	}
	next();
});

// should change from "En Reparación" to "Esperando Aprobación" if it does not has warranty, a technician is assigned, a cost is set, and costAccepted is false
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Esperando Aprobación'){ return next(); }
	if (this.status === 'En Reparación' && this.withWarranty === false && this._technician && this.cost && this.costAccepted === false){
		this.status = 'Esperando Aprobación';
	}
	next();
});

// should change from "En Reparación" to "Esperando Aprobación" if it does not has warranty, a technician is assigned, a diagnose is set, and costAccepted is false
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Esperando Aprobación'){ return next(); }
	if (this.status === 'En Reparación' && this.withWarranty === false && this._technician && this.diagnose && this.costAccepted === false){
		this.status = 'Esperando Aprobación';
	}
	next();
});

// should change from "En Reparación" to "Reparado" if it has warranty, a technician is assigned, and a solution is defined
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Reparado'){ return next(); }
	if (this.status === 'En Reparación' && this.withWarranty === true && this._technician && this.solution){
		this.status = 'Reparado';
	}
	next();
});

// should change from "En Reparación" to "Reparado" if it does not has warranty, a technician is assigned, a cost is set, costAccepted is true, and a solution is defined
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Reparado'){ return next(); }
	if (this.status === 'En Reparación' && this.withWarranty === false && this._technician && this.cost && this.costAccepted === true && this.solution){
		this.status = 'Reparado';
	}
	next();
});

// should change from "En Reparación" to "Reparado" if it does not has warranty, a technician is assigned, a diagnose is set, costAccepted is true, and a solution is defined
ServiceRequestSchema.pre('save', function(next){
	if (this.status === 'Reparado'){ return next(); }
	if (this.status === 'En Reparación' && this.withWarranty === false && this._technician && this.diagnose && this.costAccepted === true && this.solution){
		this.status = 'Reparado';
	}
	next();
});

// should change from any status to "Cerrado" if a "closedAt" date is passed
// should store the previous status in "previousStatus" when setting the status to "Cerrado
ServiceRequestSchema.pre('save', function(next){
	if (this.status         === 'Cerrado')   { return next(); }
	if (this.closedAt){
		this.previousStatus = this.status;
		this.status         = 'Cerrado';
	}
	next();
});

// should revert back to "previousState" if the status is "Cerrado" and a "closedAt" is passed as null
ServiceRequestSchema.pre('save', function(next){
	if (this.previousStatus === null){ return next(); }
	if (this.closedAt === null){
		this.status         = this.previousStatus;
		this.previousStatus = null;
	}
	next();
});

// Set the cost accepted date or set it to null
// Also change the status to 'En Reparación' or 'Esperando Aprobación'
ServiceRequestSchema.pre('save', function(next){
	if (this.costAccepted === null || this.costAccepted === undefined){ return next(); }
	if (this.costAccepted === true){
		if (!this.costAcceptedAt){ this.costAcceptedAt = new Date(); }
	} else if (this.costAccepted === false) {
		if (this.costAcceptedAt){ this.costAcceptedAt = null; }
	}
	next();
});

ServiceRequestSchema.statics.index = function(callback){
	if (!_.isFunction(callback)){ return; }
	this
		.find()
		.populate('_client'    , 'name')
		.populate('_device'    , 'brand model description')
		.populate('_technician', 'name')
		.exec(callback);
};

ServiceRequestSchema.statics.show = function(id, callback){
	if (!_.isFunction(callback)){ return; }
	if (!_.isString(id)){ callback({msg: '\'ID\' must be a string'}); }
	this
		.findOne({_id: id})
		.populate('_client'    , 'name docType docNumber phone address email')
		.populate('_device'    , 'brand model description image')
		.populate('_technician', 'name')
		.exec(callback);
}

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);