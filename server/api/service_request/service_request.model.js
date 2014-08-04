'use strict';

var mongoose = require('mongoose'),
		helper   = require('../../utils/model.helper'),
		_        = require('lodash'),
    autoInc  = require('mongoose-auto-increment'),
    Schema   = mongoose.Schema;

var ServiceRequestSchema = new Schema({
	'_client': {
		type: Schema.Types.ObjectId,
		ref : 'Client'
	},
	'_device': {
		type: Schema.Types.ObjectId,
		ref : 'Device'
	},
	'serial': String,
	'status': {
		type   : String,
		default: 'Pendiente'
	},
	'withWarranty'  : Boolean,
	'invoiceNumber' : String,
	'boughtAt'      : Date,
	'accessories'   : [String],
	'defect'        : String,
	'diagnose'      : String,
	'solution'      : String,
	'priority'      : Number,
	'technician'    : String,
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

// Set the cost accepted date or set it to null
// Also change the status to 'En Reparación' or 'Esperando Aprobación'
ServiceRequestSchema.pre('save', function(next){
	if (_.isUndefined(this.costAccepted)){ return next(); }
	if (this.costAccepted === true){
		if (!this.costAcceptedAt){ this.costAcceptedAt = new Date(); }
		if (this.status !== 'En Reparación'){ this.status = 'En Reparación'; } 
	} else if (this.costAccepted === false) {
		if (this.costAcceptedAt){ this.costAcceptedAt = null; }
		if (this.status !== 'Esperando Aprobación'){ this.status = 'Esperando Aprobación'; } 
	}
	next();
});

// If the status is closed then we set the closedAt date
ServiceRequestSchema.pre('save', function(next){
	if (_.isUndefined(this.status)){ return next(); }
	if (this.status === "Cerrado"){
		this.closedAt = new Date();
	}
	next();
});


ServiceRequestSchema.statics.index = function(callback){
	if (!_.isFunction(callback)){ return; }
	this
		.find()
		.populate('_client', 'name')
		.populate('_device', 'brand model description')
		.exec(callback);
};

ServiceRequestSchema.statics.show = function(id, callback){
	if (!_.isFunction(callback)){ return; }
	if (!_.isString(id)){ callback({msg: '"ID" must be a string'}); }
	this
		.findOne({_id: id})
		.populate('_client', 'name docType docNumber phone address email')
		.populate('_device', 'brand model description image')
		.exec(callback);
}

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);