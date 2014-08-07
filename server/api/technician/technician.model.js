'use strict';

var mongoose = require('mongoose'),
		helper   = require('../../utils/model.helper'),
    Schema   = mongoose.Schema;

var TechnicianSchema = new Schema({
	'name': {
		type: String,
		required: 'El Servicio Tecnico debe tener un "Nombre" asociado',
		unique: true,
	},
	'address': String,
	'phone'  : String,
	'email'  : String,
	'serviceRequests': [
		{
			type: Schema.Types.ObjectId,
			ref : 'ServiceRequest'
		}
	],
	'createdBy': {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	'updatedBy': {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	'createdAt': Date,
	'updatedAt': Date
});

TechnicianSchema.pre('save', helper.addTimestamps);

module.exports = mongoose.model('Technician', TechnicianSchema);