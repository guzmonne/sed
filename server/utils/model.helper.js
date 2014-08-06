var Log      = require('../api/log/log.model');
var mongoose = require('mongoose');
var async    = require('async');
var _        = require('lodash');

exports.addTimestamps = function(next){
	var date = new Date();
	if (!this.createdAt){
		this.createdAt = date;
	}
	this.updatedAt = date;
	next();
};

exports.onlyNumbers = function (string){
	return string.replace(/[^\d.]/g, "");
};