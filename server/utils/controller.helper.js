var _   = require('lodash');

exports.addUser = function(target, user){
	if (!_.isObject(target))    {return console.log('"target" must be an object');}
	if (!_.isObject(user))      {return console.log('"user" must be an object');}
	if (_.isUndefined(user._id)){return console.log('"user._id" is undefined');}
	if (target.createdBy){
		target.createdBy = user._id;
	}
	target.updatedBy = user._id;
	target.user      = user;
	return target;
};