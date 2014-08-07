'use strict';

angular.module('sedApp')
  .factory('TechnicianModel', ['Sync', function(Sync){
  	var TechnicianModel = {};
  	/*
  	** Public
  	*/
		TechnicianModel.defaults = { docType  : 'C.I.' };
		TechnicianModel.docTypes = ['C.I.', 'R.U.T'];
		TechnicianModel.empty    = function(){ return _.cloneDeep(TechnicianModel.defaults); };
		TechnicianModel.get      = function(id){
			if (!_.isString(id)) { return; }
			return Sync.from('Technician', 'show', {id:id});
		};
		TechnicianModel.create = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Technician', 'create', model);
		};
		TechnicianModel.update = function(model){
			if (!_.isObject(model)){ return; }
			return Sync.from('Technician', 'update', model);
		};
		TechnicianModel.delete = function(model){
			var id; 
			if (_.isUndefined(model)) {return;}
			if (_.isObject(model) && !_.isUndefined(model._id)){id = model._id;}
			if (_.isString(model)){id = model;}
			return Sync.from('Technician', 'delete', {id: id});
		};
		TechnicianModel.show = TechnicianModel.get;
		/*
		** Return
		*/
		return TechnicianModel;
	}]
);