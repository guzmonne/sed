'use strict';

angular.module('sedApp')
  .controller('ServiceRequestShowCtrl', function ($scope, $modal, Flash, ServiceRequestModel, Alerts, model, collection) {
  	/*
  	** Public
  	*/
    $scope.controls = {
      acceptedButton    : false,
      showDiagnoseForm  : false,
      showCostForm      : false,
      showTechnicianForm: false,
    };
    $scope.flash             = Flash;
    $scope.model             = model;
    $scope.collection        = collection;
    $scope.diagnose          = null;
    $scope.patchDiagnose     = patchDiagnose;
    $scope.patchTechnician   = patchTechnician;
    $scope.patchSolution     = patchSolution;
    $scope.patchCost         = patchCost;
    $scope.patchCostAccepted = patchCostAccepted;
    $scope.close             = close;
		// Alerts
		$scope.alerts     = [];
		$scope.closeAlert = Alerts.closeAlert;
  	/*
  	** Private
  	*/
    function close(){
      if (confirm(CONFIRM_CLOSE)){ patchClosedAt(); }
    }
    function handleError(){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: ERROR});
    }
    function patchStatus (status){
      ServiceRequestModel.patch(model._id, {status: status}).then(statusSuccess, handleError);
    }
    function patchClosedAt(){
      ServiceRequestModel.patch(model._id, {closedAt: new Date()}).then(closedAtSuccess, handleError);
    }
    function patchDiagnose(diagnose){
      ServiceRequestModel.patch(model._id, {diagnose: diagnose}).then(diagnoseSuccess, handleError);
    }
    function patchCost(cost){
      ServiceRequestModel.patch(model._id, {cost: cost}).then(costSuccess, handleError);
    }
    function patchCostAccepted(){
      ServiceRequestModel.patch(model._id, { costAccepted: $scope.model.costAccepted}).then(costAcceptedSuccess, costAcceptedError);
    }
    function patchTechnician(_technician){
      ServiceRequestModel.patch(model._id, { _technician: _technician}).then(technicianSuccess, handleError);
    }
    function patchSolution(solution){
      ServiceRequestModel.patch(model._id, { solution: solution}).then(solutionSuccess, handleError);
    }
    function costSuccess(data){
      $scope.controls.showCostForm = false;
      $scope.model.cost   = data.cost;
      $scope.model.status = data.status;
      Alerts.pushAlert($scope.alerts, { type: 'success', msg: COST_SUCCESS });
      checkDiagnose();
    }
    function diagnoseSuccess(data){
      $scope.controls.showDiagnoseForm = false;
      $scope.model.diagnose = data.diagnose;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: DIAGNOSE_SUCCESS});
      if (!$scope.model.withWarranty){ checkCost(); }
    }
    function statusSuccess(data){
      $scope.model.status = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: STATUS_SUCCESS});
    }
    function technicianSuccess(data){
      $scope.controls.showTechnicianForm = false;
      $scope.model._technician           = data._technician;
      $scope.model.status                = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: TECHNICIAN_SUCCESS});
    }
    function solutionSuccess(data){
      $scope.controls.showSolutionForm = false;
      $scope.model.solution            = data.solution;
      $scope.model.status              = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: SOLUTION_SUCCESS});
    }
    function costAcceptedSuccess(data){
      var msg = (data.costAccepted) ? COST_ACCEPTED : COST_CANCELLED;
      $scope.model.costAccepted   = data.costAccepted;
      $scope.model.costAcceptedAt = data.costAcceptedAt; 
      $scope.model.status         = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
    }
    function closedAtSuccess(data){
      $scope.model.closedAt = data.closedAt;
      $scope.model.status   = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: CLOSEDAT_SUCCESS});
    }
    function costAcceptedError(){
      $scope.model.costAccepted = !$scope.model.costAccepted;
      handleError();
    }
    function checkDiagnose(){
      if (!model.diagnose){ Alerts.pushAlert($scope.alerts, { type: 'info', msg: CHECK_DIAGNOSE });
        $scope.controls.showDiagnoseForm = true;
      }
    }
    function checkCost(){
      if (!model.cost){
        Alerts.pushAlert($scope.alerts, { type: 'info', msg: CHECK_COST });
        $scope.controls.showCostForm = true;
      }
    }
    /*
    ** Messages
    */
    var COST_SUCCESS       = 'Presupuesto guardado.';
    var COST_ACCEPTED      = 'Presupuesto aceptado';
    var COST_CANCELLED     = 'Cancelada aceptación de presupuesto';
    var CHECK_COST         = 'Es recomendable que ingrese el presupuesto de la reparación.';
    var CHECK_DIAGNOSE     = 'Es recomendable que ingrese el detalle del presupuesto en el campo diagnostico.';
    var DIAGNOSE_SUCCESS   = 'Diagnostico guardado.';
    var STATUS_SUCCESS     = 'La Orden de Servicio ha sido cerrada con exito';
    var ERROR              = 'Ha ocurrido un error en el servidor';
    var CONFIRM_CLOSE      = 'Esta acción cerrara esta orden de servicio. Desea continuar?'
    var TECHNICIAN_SUCCESS = 'Servicio Tecnico Asignado Correctamente';
    var SOLUTION_SUCCESS   = 'Solución guardada.';
    var CLOSEDAT_SUCCESS   = 'La Orden de Servicio se ha Cerrado con exito';
  });
