'use strict';

angular.module('sedApp')
  .controller('ServiceRequestShowCtrl', function ($scope, $modal, ServiceRequestModel, Alerts, model) {
  	/*
  	** Public
  	*/
    $scope.controls = {
      acceptedButton  : false,
      showDiagnoseForm: false,
      showCostForm    : false,
    };
    $scope.model             = model;
    $scope.diagnose          = null;
    $scope.patchDiagnose     = patchDiagnose;
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
      if (confirm(CONFIRM_CLOSE)){ patchStatus('Cerrado'); }
    }
    function handleError(){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: ERROR});
    }
    function patchStatus (status){
      ServiceRequestModel.patch(model._id, {status: status}).then(statusSuccess, handleError);
    }
    function patchDiagnose(diagnose){
      ServiceRequestModel.patch(model._id, {diagnose: diagnose}).then(diagnoseSuccess, handleError);
    }
    function patchCost(cost){
      ServiceRequestModel.patch(model._id, {cost: cost}).then(costSuccess, handleError);
    }
    function costSuccess(data){
      $scope.controls.showCostForm = false;
      $scope.model.cost = data.cost;
      Alerts.pushAlert($scope.alerts, {
        type: 'success', 
        msg: COST_SUCCESS
      });
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
    function checkDiagnose(){
      if (!model.diagnose){
        Alerts.pushAlert($scope.alerts, {
          type: 'info', 
          msg: CHECK_DIAGNOSE
        });
        $scope.controls.showDiagnoseForm = true;
      }
    }
    function checkCost(){
      if (!model.cost){
        Alerts.pushAlert($scope.alerts, {
          type: 'info', 
          msg: CHECK_COST
        });
        $scope.controls.showCostForm = true;
      }
    }
    function patchCostAccepted(){
      ServiceRequestModel.patch(model._id, { costAccepted: $scope.model.costAccepted}).then(costAcceptedSuccess, costAcceptedError);
    }
    function costAcceptedSuccess(data){
      var msg = (data.costAccepted) ? COST_ACCEPTED : COST_CANCELLED;
      $scope.model.costAccepted   = data.costAccepted;
      $scope.model.costAcceptedAt = data.costAcceptedAt; 
      $scope.model.status         = data.status;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
    }
    function costAcceptedError(){
      $scope.model.costAccepted = !$scope.model.costAccepted;
      handleError();
    }
    /*
    ** Messages
    */
    var COST_SUCCESS     = 'Presupuesto guardado.';
    var COST_ACCEPTED    = 'Presupuesto aceptado';
    var COST_CANCELLED   = 'Cancelada aceptación de presupuesto';
    var CHECK_COST       = 'Es recomendable que ingrese el presupuesto de la reparación.';
    var CHECK_DIAGNOSE   = 'Es recomendable que ingrese el detalle del presupuesto en el campo diagnostico.';
    var DIAGNOSE_SUCCESS = 'Diagnostico guardado.';
    var STATUS_SUCCESS   = 'La Orden de Servicio ha sido cerrada con exito';
    var ERROR            = 'Ha ocurrido un error en el servidor';
    var CONFIRM_CLOSE    = 'Esta acción cerrara esta orden de servicio. Desea continuar?'
  });
