var _   = require('lodash');

exports.addUser = function(target, user){
	if (!_.isObject(target) || !_.isObject(user) || _.isUndefined(user._id)){ 
		return target; 
	}
	if (target.createdBy){
		target.createdBy = user._id;
	}
	target.updatedBy = user._id;
	target.user      = user;
	return target;
};