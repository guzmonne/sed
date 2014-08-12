'use strict';

angular.module('sedApp')
  .factory('ServiceRequestClientInvoice', function($filter){
		var ServiceRequestClientInvoice = {};
  	/*
  	** Private
  	*/
		var line = {
		    vLineWidth: function(){ return 0; },
		    hLineWidth: function(i, node){ return (i === node.table.body.length) ? 1 : 0; }
		};
		var noLines = {
		    vLineWidth: function(){ return 0; },
		    hLineWidth: function(){ return 0; }
		};
		var firstAndLastLines = {
		    vLineWidth: function(){ return 0; },
		    hLineWidth: function(i, node){ return (i === 0 || i === node.table.body.length) ? 2 : 0; }
		};
		var lastLine = {
		    hLineWidth: function(i, node){ if (i === node.table.body.length - 1){ return 2; } else { return 0; } },
		    vLineWidth: function(i, node){ return 0;  }
		};
		var model, defaults = {
			invoiceNumber: ' ',
			boughtAt     : ' ',
			accessories  : [],
			id: ' ',
			_device: {
				brand      : ' ',
				model      : ' ',
				description: ' ',
			},
			_client: { 
				name     : ' ',
				phone    : ' ',
				address  : ' ',
				docType  : 'C.I.',
				docNumber: ' ' 
			},
			defect      : ' ',
			observations: ' ',
			serial      : ' ',
			createdBy   : {
				name: ' ',
			}
		};
		function report(model){
			return {
				content: [
					{
						style: 'tableHeader',
						table: {
				    	widths: ['*', '*', '*'],
							body: [
								[$filter('date')(new Date(), 'dd MMMM yyyy'), '', {text: 'R.U.T. 21 6637720015', alignment: 'right'}],
								[{ colSpan: 3, alignment: 'center', fontSize: '48', text: 'electrodigitales' }],
								[{ text: 'Miguelete 2181 esq. Requena', alignment: 'left'}, { text: 'Telefono y fax: 2401 9975', alignment: 'center' }, { text: 'info@electrodigitales.com', alignment: 'right' }],
							]
						},
						layout: lastLine
					},
					{
			    	columnGap: 20,
			    	style: 'body',
			    	columns: [
			        {
		            text: "ORDEN DE SERVICIO", 
		            width: 'auto', 
		            bold: true,
		            fontSize: 16
			        },
			        {
		            text: "#" + model.id, 
		            width: '*',
		            fontSize: 20,
		            bold: true,
		            alignment: 'left'
			        },
			        {
		            text: "Recibido: " + $filter('date')(model.createdAt, 'dd MMMM yyyy'), 
		            width: '*',
		            fontSize: 14,
		            alignment: 'right'
		      	  },
			    	]
					},
					{
			    	columnGap: 20,
			    	style: 'body',
			    	columns: [
			        {
		            columnGap: 5,
		            columns: [
	                { text: "Nombre", width: 60, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model._client.name] ] }, layout: line }
		            ]
			        },
			        {
		            columnGap: 5,
		            columns: [
	                { text: model._client.docType, width: 50, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model._client.docNumber] ] }, layout: line }
		            ]
			        }
			    	]
					},
					{
			    	columnGap: 20,
			    	style: 'body',
			    	columns: [
			        {
		            columnGap: 5,
		            columns: [
	                { text: "Dirección", width: 60, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model._client.address] ] }, layout: line }
		            ]
			        },
			        {
		            columnGap: 5,
		            columns: [
	                { text: 'Telefono', width: 50, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model._client.phone] ] }, layout: line }
		            ]
		        	}
				    ]
					},
					{
				    columnGap: 20,
				    style: 'body',
				    columns: [
			        {
		            columnGap: 5,
		            columns: [
	                { text: "Boleta de Compra", width: 60, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model.invoiceNumber] ] }, layout: line }
		            ]
			        },
			        {
		            columnGap: 5,
		            columns: [
	                { text: 'Fecha de Compra', width: 50, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [$filter('date')(model.boughtAt, 'dd MMMM yyyy')] ] }, layout: line }
		            ]
			        }
				    ]
					},
					{
				    margin: [0,10,0,0],
				    table: {
			        widths: [70 ,'*',80,'*', '*'],
			        body: [
		            [ { text: 'Marca', bold: true },{ text: 'Modelo', bold: true },{ text: 'Descripción', bold: true },{ text: 'Serie', bold: true }, {text: 'Accesorios', bold: true} ],
		            [model._device.brand, model._device.model, model._device.description, model.serial, { stack: model.accessories }]
			        ]
				    }
					},
					{
				    columnGap: 20,
				    style: 'body',
				    columns: [
			        {
		            columnGap: 5,
		            columns: [
	                { text: "Defecto", width: 80, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model.defect] ] }, layout: line }
		            ]
			        }
				    ]
					},
					{
				    columnGap: 20,
				    style: 'body',
				    columns: [
			        {
			            columnGap: 5,
			            columns: [
			                { text: "Observaciones", width: 80, bold: true },
			                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model.observations] ] }, layout: line }
			            ]
			        }
				    ]
					},
					{   
				    margin: [0,30,0,20],
				    table: {
			        widths: ['*'],
			        body: [
			            [{ text: 'Sr. Cliente: Verifique la información arriba detallada, todo reclamo será corroborado con esta boleta.', margin: [0,10,0,0] , fontSize: 10}],
			            [{ text: 'El extravío de esta boleta conlleva la pérdida de los derechos de reclamo.', fontSize: 10}],
			            [{
			            	margin: [0,10,0,10],
	          		    columnGap: 10,
	          		    style: 'body',
	          		    columns: [
	        		        {
	        		            columnGap: 5,
	        		            width: 220,
	        		            columns: [
        		                { text: "Recibido por", width: 70, bold: true },
        		                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [model.createdBy.name] ] }, layout: line }
	        		            ]
	        		        },
	        		        {
	        	            columnGap: 5,
	        		            columns: [
        		                { text: "Firma del cliente", width: 70, bold: true },
        		                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [' '] ] }, layout: line }
	        		            ]
	        		        }
	          		    ]
	          			}
	          		]
		        	]	
				    },
				    layout: firstAndLastLines
					},
					{
				    columnGap: 20,
				    style: 'body',
				    columns: [
				        {
                  text: 'RETIRO CONFORME',
                  width: 130,
                  bold: true
				        },
		              {
			            columnGap: 5,
			            columns: [
		                { text: "FIRMA", width: 80, bold: true },
		                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [' '] ] }, layout: line }
			            ]
				        },
				    ]
					},
					{
				    columnGap: 20,
				    style: 'body',
				    columns: [
			        {
                text: ' ',
                width: 130
			        },
	              {
		            columnGap: 5,
		            columns: [
	                { text: "ACLARACIÓN", width: 80, bold: true },
	                { margin: [0,-5,0,0], table: { widths: ['*'], body: [ [' '] ] }, layout: line }
		            ]
			        },
				    ]
					},
				],
				styles: {
			    tableHeader: {
				    margin: [0, 0, 0, 0],
				    fontSize: 10,
			    },
			    body: {
			      margin: [5,20,0,0]
			    }
				},
				pageMargins: [ 15, 20, 20, 20 ],
			};
		};
		function extendModel(_model){
			if (!_model){ return; }
  		model = _.merge(_.cloneDeep(defaults), _model);
		}
  	/*
  	** Public
  	*/
  	ServiceRequestClientInvoice.print = function(_model){
  		extendModel(_model);
  		pdfMake.createPdf(report(model)).print();
  	};
  	ServiceRequestClientInvoice.download = function(_model){
  		extendModel(_model);
  		pdfMake.createPdf(report(model)).download('Orden de Servicio #' + model.id + ' - Cliente');
  	}
  	/*
  	** Return
  	*/
		return ServiceRequestClientInvoice;
  }
);