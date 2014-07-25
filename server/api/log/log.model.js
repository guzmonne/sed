'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var LogSchema = new Schema({
	'user': {
		type : Schema.Types.ObjectId,
		ref  : 'User'
	},
	'col'       : String,
	'doc'       : Schema.Types.ObjectId,
	'message'   : String,
	'type'      : String,
	'createdAt' : Date,
});

LogSchema.pre('save', function(next){
	this.createdAt = new Date();
	next();
});

module.exports = mongoose.model('Log', LogSchema);