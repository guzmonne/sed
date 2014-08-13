'use strict';
/* global confirm */

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
    $scope.flash                     = Flash;
    $scope.model                     = model;
    $scope.collection                = collection;
    $scope.diagnose                  = null;
    $scope.patchDiagnose             = patchDiagnose;
    $scope.patchTechnician           = patchTechnician;
    $scope.patchSolution             = patchSolution;
    $scope.patchCost                 = patchCost;
    $scope.patchCostAccepted         = patchCostAccepted;
		// Alerts
		$scope.alerts     = [];
		$scope.closeAlert = Alerts.closeAlert;
  	/*
  	** Private
  	*/
    function handleError(){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: ERROR});
    }
    function patchDiagnose(diagnose){
      ServiceRequestModel.patch(model._id, {diagnose: diagnose}).then(diagnoseSuccess, handleError);
    }
    function patchCost(cost){
      ServiceRequestModel.patch(model._id, {cost: cost}).then(costSuccess, handleError);
    }
    function patchCostAccepted(accepted){
      ServiceRequestModel.patch(model._id, { costAccepted: accepted}).then(costAcceptedSuccess, costAcceptedError);
    }
    function patchTechnician(_technician){
      ServiceRequestModel.patch(model._id, { _technician: _technician}).then(technicianSuccess, handleError);
    }
    function patchSolution(solution){
      ServiceRequestModel.patch(model._id, { solution: solution}).then(solutionSuccess, handleError);
    }
    function costSuccess(data){
      $scope.controls.showCostForm = false;
      $scope.model.cost            = data.cost;
      $scope.model.status          = data.status;
      Alerts.pushAlert($scope.alerts, { type: 'success', msg: COST_SUCCESS }, 0);
      checkDiagnose();
    }
    function diagnoseSuccess(data){
      $scope.controls.showDiagnoseForm = false;
      $scope.model.diagnose = data.diagnose;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: DIAGNOSE_SUCCESS}, 0);
    }
    function technicianSuccess(data){
      $scope.controls.showTechnicianForm = false;
      $scope.model._technician           = data._technician;
      $scope.model.status                = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: TECHNICIAN_SUCCESS}, 0);
    }
    function solutionSuccess(data){
      $scope.controls.showSolutionForm = false;
      $scope.model.solution            = data.solution;
      $scope.model.status              = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: SOLUTION_SUCCESS}, 0);
    }
    function costAcceptedSuccess(data){
      var msg;
      switch(data.costAccepted){
        case true : msg = COST_ACCEPTED ; break;
        case false: msg = COST_CANCELLED; break;
        case null : msg = COST_RESET    ; break;
      }
      $scope.model.costAccepted   = data.costAccepted;
      $scope.model.costAcceptedAt = data.costAcceptedAt; 
      $scope.model.status         = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg}, 0);
    }
    function costAcceptedError(){
      $scope.model.costAccepted = !$scope.model.costAccepted;
      handleError();
    }
    function checkDiagnose(){
      if (!model.diagnose){ Alerts.pushAlert($scope.alerts, { type: 'info', msg: CHECK_DIAGNOSE }, 0);
        $scope.controls.showDiagnoseForm = true;
      }
    }
    /*
    ** Messages
    */
    var COST_SUCCESS       = 'Presupuesto guardado.';
    var COST_ACCEPTED      = 'Presupuesto aceptado';
    var COST_CANCELLED     = 'Presupuesto no aceptado';
    var COST_RESET         = 'Esperando aprobación';
    var CHECK_COST         = 'Es recomendable que ingrese el presupuesto de la reparación.';
    var CHECK_DIAGNOSE     = 'Es recomendable que ingrese el detalle del presupuesto en el campo diagnostico.';
    var DIAGNOSE_SUCCESS   = 'Diagnostico guardado.';
    var ERROR              = 'Ha ocurrido un error en el servidor';
    var TECHNICIAN_SUCCESS = 'Servicio Tecnico Asignado Correctamente';
    var SOLUTION_SUCCESS   = 'Solución guardada.';
  });
