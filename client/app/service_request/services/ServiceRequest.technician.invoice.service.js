'use strict';

angular.module('sedApp')
  .factory('ServiceRequestTechnicianInvoice', function($filter){
var ServiceRequestTechnicianInvoice = {};
  	/*
  	** Private
  	*/
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
		var dd = {
			content: [],
			styles: {
				title: {
					fontSize : 18,
					bold     : true,
					alignment: 'center'
				},
				defaults: {
				    fontSize: 9
				},
				id: {
						fontSize : 18,
						alignment: 'right'
				}
			},
			pageSize   : 'A4',
			pageMargins: [25,20,25,20]
		};
		function technician(model){
			return {
				style: 'defaults',
				table: {
					widths: [100, 50, 50, 50, 50, '*'],
					body: [
						[ {colSpan: 6, text: 'electrodigitales ltda.', style: 'title'}, ' ', ' ', ' ', ' ', ' '],
						[ {margin: [0,3,0,0], colSpan: 4, columnGap: 5, columns: [{ width: 50, bold: true, stack: ['Tel:', 'Dirección:', 'Mail'] }, {stack: [ '2401 9975', 'Miguelete 2181', 'info@electrodigitales.com' ]}]}, ' ', ' ', ' ', { style: 'id' ,colSpan: 2, stack: ['#' + model.id, { fontSize: 12, text: $filter('date')(new Date(), 'dd MMMM yyyy') }]  }, 'A'],
						[ {text: 'DOCUMENTO INTERNO DE ENVÍO A SERVICIO TECNICO', colSpan: 6, alignment: 'center', fontSize: 11, bold: true}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Marca', alignment: 'right', bold: true}, {text: model._device.brand, colSpan:4}, ' ', ' ', ' ', {text: 'Accesorios', bold: true}],
						[ {text: 'Modelo', alignment: 'right', bold: true}, {text: model._device.model, colSpan:4}, ' ', ' ', ' ', {stack: model.accessories, rowSpan: 3}],
						[ {text: 'Descripción', alignment: 'right', bold: true}, {text: model._device.description, colSpan:4}, ' ', ' ', ' ', ' '],
						[ {text: 'Defecto', bold: true, colSpan: 5}, ' ', ' ', ' ', ' ', ' '],
						[ {text: model.defect + '\n\n', colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Observaciones', bold: true, colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: model.observations + '\n\n', colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Nota: No se abonaran reparaciones fuera de fecha', alignment:'center', colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Presupuesto autorizado por', alignment: 'right', bold: true, colSpan:2}, ' ', {text: ' ', colSpan: 4}, ' ', ' ', ' '],
						[ {text: 'Fecha', alignment: 'right', bold: true, colSpan:2}, ' ', {text: ' ', colSpan: 4}, ' ', ' ', ' '],
						[ {text: '', colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Presupuesto Aceptado por el cliente', alignment: 'right', bold: true, colSpan:2}, ' ', {alignment: 'center', text: 'SI'}, {alignment: 'center', text: 'NO'}, {alignment: 'right', bold: true, text:'Fecha'}, ' '],
						[ {text: '', colSpan: 6}, ' ', ' ', ' ', ' ', ' '],
						[ {text: 'Recibido por', colSpan: 4}, ' ', ' ', ' ',  {alignment: 'right', bold: true, text:'Fecha'}, ' '],
					]
				},
				layout: {
			    hLineWidth: function(i, node){
		        var length = node.table.body.length;
		        if (i === 2 || i === 3 || i === 10 || i === 11 || i === 13 || i === 14 || i === 15 || i === 16){ return 2; }
		        return 1;
			    }
				}
    	};
    }
    function middleLine(content){
    	content.push({ text:'\n\n' });
    	content.push({
        table: {
					widths: ['*'],
					body  : [ [ '' ] ]
        },
        layout: {
          vLineWidth: function(){ return 0; },
          hLineWidth: function(i){ return (i === 0) ? 1 : 0 }
        }
    	});
    	content.push({ text:'\n\n' });
    }
		function extendModel(_model){
			if (!_model){ return; }
  		return _.merge(_.cloneDeep(defaults), _model);
		}
		function buildReport(_model){
			var report = _.cloneDeep(dd);
			model      = extendModel(_model);
  		report.content.push(technician(model));
  		middleLine(report.content);
  		report.content.push(technician(model));
			return report;
		}
  	/*
  	** Public
  	*/
  	ServiceRequestTechnicianInvoice.print = function(_model){
  		var report = buildReport(_model);
  		pdfMake.createPdf(report).print();
  	};
  	ServiceRequestTechnicianInvoice.download = function(_model){
  		var report = buildReport(_model);
  		pdfMake.createPdf(report).download('Orden de Servicio #' + model.id + ' - Servicio Tecnico');
  	}
  	/*
  	** Return
  	*/
		return ServiceRequestTechnicianInvoice;
  });