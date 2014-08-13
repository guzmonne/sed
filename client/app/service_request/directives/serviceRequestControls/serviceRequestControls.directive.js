'use strict';

angular.module('sedApp')
  .directive('serviceRequestControls', function () {
		return {
      templateUrl: 'app/service_request/directives/serviceRequestControls/serviceRequestControls.html',
      scope: {
        model   : '=serviceRequestControls',
        alerts  : '='
      },
      controller: ['$scope', 'ServiceRequestModel', 'Alerts', 'ServiceRequestClientInvoice', 'ServiceRequestTechnicianInvoice', function($scope, ServiceRequestModel, Alerts, ServiceRequestClientInvoice, ServiceRequestTechnicianInvoice){
				/*
				** Public
				*/
				$scope.close                     = closeServiceRequest;
				$scope.printClientInvoice        = ServiceRequestClientInvoice.print;
				$scope.downloadClientInvoice     = ServiceRequestClientInvoice.download;
				$scope.printTechnicianInvoice    = ServiceRequestTechnicianInvoice.print;
				$scope.downloadTechnicianInvoice = ServiceRequestTechnicianInvoice.download;
      	/*
      	** Private
      	*/
		    function closeServiceRequest(){
		      if (confirm(CONFIRM_CLOSE)){ patchClosedAt(); }
		    }
        function patchClosedAt(){
		      ServiceRequestModel.patch(model._id, {closedAt: new Date()}).then(closedAtSuccess, handleError);
		    }
        function closedAtSuccess(data){
		      $scope.model.closedAt = data.closedAt;
		      $scope.model.status   = data.status;
		      Alerts.pushAlert($scope.alerts, {type: 'success', msg: CLOSEDAT_SUCCESS}, 0);
		    }
        function handleError(){
		      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: ERROR});
		    }
		    /*
		    ** Strings
		    */
				var CONFIRM_CLOSE    = 'Esta acción cerrara esta orden de servicio. Desea continuar?';
				var ERROR            = 'Ha ocurrido un error en el servidor';
				var CLOSEDAT_SUCCESS = 'La Orden de Servicio se ha Cerrado con exito';
      }],
      link: function (scope, element) {

      }
    };
  });