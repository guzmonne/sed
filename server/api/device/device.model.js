'use strict';

var mongoose = require('mongoose'),
		helper   = require('../../utils/model.helper'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
	'model': {
		type: String,
		unique: true,
		required: 'El campo de "modelo" no puede quedar vacío',
	},
	'brand':{
		type: String,
		required: 'El campo de "marca" no puede quedar vacío',
	},
	"description": {
		type: String,
		required: 'El campo de "descripción" no puede quedar vacío'
	},
	"image": String,
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

DeviceSchema.pre('save', helper.addTimestamps);

module.exports = mongoose.model('Device', DeviceSchema);