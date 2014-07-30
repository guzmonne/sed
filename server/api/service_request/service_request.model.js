'use strict';

var mongoose = require('mongoose'),
		helper   = require('../../utils/model.helper'),
		_        = require('lodash'),
    autoInc  = require('mongoose-auto-increment'),
    Schema   = mongoose.Schema;

var ServiceRequestSchema = new Schema({
	'client_id': {
		type: Schema.Types.ObjectId,
		ref : 'Client'
	},
	'device_id': {
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

ServiceRequestSchema.pre('save', helper.addTimestamps);

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);