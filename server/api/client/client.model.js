'use strict';

var mongoose = require('mongoose'),
		async    = require('async'),
		helper   = require('../../utils/model.helper'),
    Schema   = mongoose.Schema;

var ClientSchema = new Schema({
	'name'     : {
		type: String,
		required: true
	},
	'docType'  : String,
	'docNumber': {
		type    : String,
		required: 'El campo "documento" no puede quedar vacío',
		unique  : true,
		set     : helper.onlyNumbers,
	},
	'address': String,
	'phone'   : {
		type: String,
		set : helper.onlyNumbers
	},
	'createdBy': {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	'updatedBy': {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	'email': {
		type: String,
		lowercase: true
	},
	'createdAt': Date,
	'updatedAt': Date
});

ClientSchema.pre('save', helper.addTimestamps);

module.exports = mongoose.model('Client', ClientSchema);