'use strict';

angular.module('sedApp')
  .directive('clientTable', function ($compile) {
    return {
      templateUrl: 'components/templates/defaultTable.html',
      restrict: 'AE',
      scope: {
      	collection: '=clientTable',
      },
      controller: ['$scope', function($scope){
      	/*
      	** Public
      	*/
      	$scope.table = [
      		{ attribute: 'name'     , name: 'Nombre'      , show: true, content: '{{model.name}}' },
      		{ attribute: 'docType'  , name: 'Tipo de Doc.', show: true, content: '{{model.docType}}' },
      		{ attribute: 'docNumber', name: 'Doc.'        , show: true, content: '{{model.docNumber}}' },
      		{ attribute: 'phone'    , name: 'Telefono'    , show: true, content: '{{model.phone}}' },
      		{ attribute: 'address'  , name: 'Dirección'   , show: true, content: '{{model.address}}' },
      		{ attribute: 'email'    , name: 'Email'       , show: true, content: '{{model.email}}' },
      	];
      	$scope.options = {
					sortField    : 'name',
					sortReverse  : false,
					searchString : '',
					modelsPerPage: 10,
					totalItems   : 0,
					currentPage  : 1,
      	};
      	$scope.sort = sort;
      	/*
      	** Private
      	*/
      	function sort(attribute){
					$scope.options.sortReverse = ($scope.options.sortField === attribute) ? !$scope.options.sortReverse : false;
					$scope.options.sortField   = attribute;
      	}
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
      	function buildTable(){
	        var head   = angular.element('<tr></tr>');
	        var body   = angular.element('<tr></tr>');
	        _.each(scope.table, function(column, index){
	        	var headerClass = (column.headerClass) ? ' class="' + column.headerClass + '"' : '';
	        	var columnClass = (column.columnClass) ? ' class="' + column.columnClass + '"' : '';
	        	head.append('<th'+headerClass+' class="pointer" ng-click="sort(\''+column.attribute+'\')" ng-show="table['+index+'].show">'+column.name+'<i class="pull-right fa" ng-class="{\'fa-chevron-down\': options.sortField === \''+column.attribute+'\' && options.sortReverse === true, \'fa-chevron-up\': options.sortField === \''+column.attribute+'\' && options.sortReverse === false }"></i>'+'</th>');
	        	body.append('<td'+columnClass+' ng-show="table['+index+'].show">'+column.content+'</td>');
	        });
	        body.append([
						'<td>',
							'<div class="btn-toolbar">',
								'<div class="btn-group">',
									'<a ui-sref="client.show({id: model._id})" class="btn btn-info btn-sm">',
										'<i class="fa fa-ellipsis-h fa-fw"></i>',
									'</a>',
								'</div>',
								'<div class="btn-group">',
									'<a ui-sref="client.edit({id: model._id})" class="btn btn-warning btn-sm">',
										'<i class="fa fa-pencil fa-fw"></i>',
									'</a>',
									'<button class="btn btn-danger btn-sm" ng-if="isAdmin()" ng-click="delete(model)">',
										'<i class="fa fa-trash-o fa-fw"></i>',
									'</button>',
								'</div>',
							'</div>',
						'</td>'
	        ].join(''));
	        body.attr('ng-repeat', [
		        	'model in collection ',
							'| orderBy:options.sortField:options.sortReverse',
							'| filter:options.searchString',
							'| startFrom:(options.currentPage-1) * options.modelsPerPage',
							'| limitTo:options.modelsPerPage',
	        	].join('') 
					);
					head = $compile(head)(scope);
					body = $compile(body)(scope);
					element.find('thead').html(head);
					element.find('tbody').html(body);
      	}
      	/*
      	** Initialize
      	*/
      	buildTable();
      	//scope.$watch('table', buildTable);
      }
    };
  });