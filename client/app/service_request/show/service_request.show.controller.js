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
		// Alerts
		$scope.alerts     = [];
		$scope.closeAlert = Alerts.closeAlert;
  	/*
  	** Private
  	*/
    function handleError(){
      Alerts.pushAlert($scope.alerts, {type: 'danger', msg: 'Ha ocurrido un error en el servidor'});
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
        msg: 'Presupuesto guardado.'
      });
      checkDiagnose();
    }
    function diagnoseSuccess(data){
      $scope.controls.showDiagnoseForm = false;
      $scope.model.diagnose = data.diagnose;
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: 'Diagnostico guardado.'});
      checkCost();
    }
    function checkDiagnose(){
      if (!model.diagnose){
        Alerts.pushAlert($scope.alerts, {
          type: 'info', 
          msg: 'Es recomendable que ingrese el detalle del presupuesto en el campo diagnostico.'
        });
        $scope.controls.showDiagnoseForm = true;
      }
    }
    function checkCost(){
      if (!model.cost){
        Alerts.pushAlert($scope.alerts, {
          type: 'info', 
          msg: 'Es recomendable que ingrese el presupuesto de la reparación.'
        });
        $scope.controls.showCostForm = true;
      }
    }
    function patchCostAccepted(){
      ServiceRequestModel.patch(model._id, {
        costAccepted: $scope.model.costAccepted
      }).then(costAcceptedSuccess, costAcceptedError);
    }
    function costAcceptedSuccess(data){
      var msg = (data.costAccepted) ? "Presupuesto aceptado" : "Cancelada aceptación de presupuesto"
      $scope.model.costAccepted   = data.costAccepted;
      $scope.model.costAcceptedAt = data.costAcceptedAt; 
      Alerts.pushAlert($scope.alerts, {type: 'success', msg: msg});
    }
    function costAcceptedError(){
      $scope.model.costAccepted = !$scope.model.costAccepted;
      handleError();
    }
  });
