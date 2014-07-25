var Log = require('../api/log/log.model');

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
