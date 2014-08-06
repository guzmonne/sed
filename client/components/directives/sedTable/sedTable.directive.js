'use strict';

angular.module('sedApp')
  .directive('sedTable', function ($compile) {
    return {
      templateUrl: 'components/templates/defaultTable.html',
      restrict: 'AE',
      scope: {
				collection : '=',
				type       : '@',
				delete     : '&',
      },
      controller: ['$scope', 'Auth', function($scope, Auth){
      	/*
      	** Public
      	*/
      	$scope.table = [];
      	$scope.options = {
					sortField      : '',
					sortReverse    : false,
					searchString   : '',
					filterField    : '',
					filterFieldName: null,
					modelsPerPage  : 10,
					totalItems     : 0,
					currentPage    : 1,
      	};
				$scope.sort              = sort;
				$scope.search            = search;
				$scope.selectFilterField = selectFilterField;
      	$scope.isAdmin           = Auth.isAdmin;
      	$scope.remove            = remove;
      	/*
      	** Private
      	*/
      	var tables = {
      		client: {
      			sortField: 'name',
      			data : [
		      		{ attribute: 'name'     , name: 'Nombre'      , show: true, content: '{{model.name}}' },
		      		{ attribute: 'docType'  , name: 'Tipo de Doc.', show: true, content: '{{model.docType}}' },
		      		{ attribute: 'docNumber', name: 'Doc.'        , show: true, content: '{{model.docNumber}}' },
		      		{ attribute: 'phone'    , name: 'Telefono'    , show: true, content: '{{model.phone}}' },
		      		{ attribute: 'address'  , name: 'Dirección'   , show: true, content: '{{model.address}}' },
		      		{ attribute: 'email'    , name: 'Email'       , show: true, content: '{{model.email}}' },
		      	]
      		},
      		device: {
      			sortField: 'brand',
      			data: [
		      		{ attribute: 'image'      , name: 'Imagen'      , show: true, content: '<img height="100" ng-src="{{model.image}}" alt="{{model.model}}" />' },
		      		{ attribute: 'brand'      , name: 'Marca'       , show: true, content: '{{model.brand}}' },
		      		{ attribute: 'model'      , name: 'Modelo'      , show: true, content: '{{model.model}}' },
		      		{ attribute: 'description', name: 'Descripción' , show: true, content: '{{model.description}}' },
      			]
      		},
      		service_request: {
      			sortField: 'id',
      			data :[
		      		{ attribute: 'id'                  , name: 'ID'                   , show: true, content: '{{model.id}}' },
		      		{ attribute: '_client.name'        , name: 'Nombre'               , show: true, content: '{{model._client.name}}' ,columnClass: 'no-wrap'},
		      		{ attribute: '_device.brand'       , name: 'Marca'                , show: true, content: '{{model._device.brand}}' },
		      		{ attribute: '_device.model'       , name: 'Modelo'               , show: true, content: '{{model._device.model}}', columnClass: 'no-wrap'},
		      		{ attribute: '_device.description' , name: 'Descripción'          , show: true, content: '{{model._device.description}}' },
		      		{ attribute: 'serial'              , name: 'Serie'                , show: true, content: '{{model.serial}}' },
		      		{ attribute: 'status'              , name: 'Estado'               , show: true, content: '<span service-request-status-label="{{model.status}}"></span>' },
		      		{ attribute: 'withWarranty'        , name: 'Garantía'             , show: true, content: '<i class="fa fa-check" ng-if="model.withWarranty === true"></i>', columnClass: 'text-center'},
		      		{ attribute: 'invoiceNumber'       , name: 'N° Boleta'            , show: true, content: '{{model.invoiceNumber}}' },
		      		{ attribute: 'boughtAt'            , name: 'Fecha de Compra'      , show: true, content: '{{model.boughtAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
		      		{ attribute: 'accessories'         , name: 'Accesorios'           , show: false, content: '<ul class="half-left-padding"><li ng-repeat="accessory in model.accessories">{{accessory}}</li></ul>', columnClass: 'no-wrap'},
		      		{ attribute: 'defect'              , name: 'Defecto'              , show: false, content: '{{model.defect}}' },
		      		{ attribute: 'priority'            , name: 'Prioridad'            , show: true, content: '{{model.priority}}', columnClass: "text-center" },
		      		{ attribute: 'technician'          , name: 'Tecnico'              , show: true, content: '{{model.technician}}' },
		      		{ attribute: 'cost'                , name: 'Presupuesto'          , show: true, content: '{{model.cost | currency}}' },
		      		{ attribute: 'costAccepted'        , name: 'Presupuesto Aceptado' , show: false, content: '<i class="fa fa-check" ng-if="model.costAccepted === true"></i>', columnClass: 'text-center' },
		      		{ attribute: 'costAcceptedAt'      , name: 'Aceptado'             , show: true, content: '{{model.costAcceptedAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
		      		{ attribute: 'authorizedBy'        , name: 'Autorizador'          , show: false, content: '{{model.authorizedBy}}' },
		      		{ attribute: 'authorizedAt'        , name: 'Autorizado'           , show: false, content: '{{model.authorizedAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
		      		{ attribute: 'createdAt'           , name: 'Creado'               , show: true, content: '{{model.createdAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
		      		{ attribute: 'updatedAt'           , name: 'Actualizado'          , show: false, content: '{{model.updatedAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
		      		{ attribute: 'closedAt'            , name: 'Cerrado'              , show: true, content: '{{model.closedAt | date:\'dd MMMM yyyy\'}}', columnClass: 'no-wrap' },
      			]
      		}
      	}
      	function sort(attribute){
					$scope.options.sortReverse = ($scope.options.sortField === attribute) ? !$scope.options.sortReverse : false;
					$scope.options.sortField   = attribute;
      	}
      	function setTable(type){
					var table                = tables[type];
					$scope.options.sortField = table.sortField;
					$scope.table             = table.data;
      	}
      	function search(){
      		var obj = {};
      		var arr = [];
      		if ($scope.options.filterField === ''){ return $scope.options.searchString; }
      		arr = $scope.options.filterField.split('.');
      		if (arr.length > 1){
      			for (var i = 0; i < arr.length; i++){
      				if (i === 0){ obj[arr[0]] = {};	
      				} else if ( i === arr.length - 1 ){
      					obj[arr[i-1]][arr[i]] = $scope.options.searchString;
      				} else {
      					obj[arr[i-1]][arr[i]] = {};
      				}
      			}
      			return obj;
      		}
      		obj[$scope.options.filterField] = $scope.options.searchString;
      		return obj;
      	}
      	function selectFilterField(column){
      		if (_.isUndefined(column)){ column = { name: null, attribute: '' }; } 
      		$scope.options.filterFieldName = column.name;
      		$scope.options.filterField     = column.attribute;
      	}
      	function remove(model){
      		$scope.delete({model: model});
      	}
      	/*
      	** Initialize
      	*/
      	setTable($scope.type);
      }],
      link: function (scope, element, attrs) {
      	/*
      	** Watchers
      	*/
      	scope.$watch('collection', function(){
      		scope.options.totalItems = scope.collection.length;
      	});
      	/*
      	** Private
      	*/
      	function buttonsFor(type){
      		return [
						'<td>',
							'<div class="btn-toolbar">',
								'<div class="btn-group">',
									'<a ui-sref="'+type+'.show({id: model._id})" class="btn btn-info btn-xs">',
										'<i class="fa fa-ellipsis-h fa-fw"></i>',
									'</a>',
								'</div>',
								'<div class="btn-group">',
									'<a ui-sref="'+type+'.edit({id: model._id})" class="btn btn-warning btn-xs">',
										'<i class="fa fa-pencil fa-fw"></i>',
									'</a>',
								'</div>',
								'<div class="btn-group">',
									'<button class="btn btn-danger btn-xs" ng-if="isAdmin()" ng-click="remove(model)">',
										'<i class="fa fa-trash-o fa-fw"></i>',
									'</button>',
								'</div>',
							'</div>',
						'</td>'
	        ].join('');
      	}
      	function buildTable(){
	        var head   = angular.element('<tr></tr>');
	        var body   = angular.element('<tr></tr>');
	        // Table data iteration
	        _.each(scope.table, function(column, index){
	        	var headerClass = (column.headerClass) ? ' class="' + column.headerClass + '"' : '';
	        	var columnClass = (column.columnClass) ? ' class="' + column.columnClass + '"' : '';
	        	head.append('<th'+headerClass+' class="pointer" ng-click="sort(\''+column.attribute+'\')" ng-show="table['+index+'].show">'+column.name+'<i class="pull-right fa" ng-class="{\'fa-chevron-down\': options.sortField === \''+column.attribute+'\' && options.sortReverse === true, \'fa-chevron-up\': options.sortField === \''+column.attribute+'\' && options.sortReverse === false }"></i>'+'</th>');
	        	body.append('<td'+columnClass+' ng-show="table['+index+'].show">'+column.content+'</td>');
	        });
	        // Body config
	        body.append(buttonsFor(scope.type));
	        body.attr('ng-repeat', [
		        	'model in collection ',
							'| orderBy:options.sortField:options.sortReverse',
							'| filter:search()',
							'| startFrom:(options.currentPage-1) * options.modelsPerPage',
							'| limitTo:options.modelsPerPage',
	        	].join('') 
					);
					// Compilation
					head = $compile(head)(scope);
					body = $compile(body)(scope);
					element.find('thead').html(head);
					element.find('tbody').html(body);
      	}
      	function hideColumns(){
      		var hideColumns = scope.$eval(attrs.hideColumns);
      		_.forEach(hideColumns, function(columnName){
      			var column = _.find(scope.table, function(column){return column.attribute === columnName});
      			if (column) { column.show = false; }
      		});
      	}
      	/*
      	** Initialize
      	*/
      	buildTable();
      	hideColumns();
      }
    };
  });