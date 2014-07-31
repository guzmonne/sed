'use strict';

describe('Directive: serviceRequestForm', function () {

  // load the directive's module and view
  beforeEach(module('sedApp'));
  beforeEach(module('app/service_request/directives/serviceRequestForm/serviceRequestForm.html'));

  var element, scope, iScope, $httpBackend;

  beforeEach(inject(function ($compile, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    scope.model = {_id: 1, accessories: []};
    scope.clients = [ {name: 'Unit Test'}, {name: 'Foo Bar'} ];
    scope.devices = [
      { model: 'model1', brand: 'brand1', description: 'description1' },
      { model: 'model2', brand: 'brand2', description: 'description2' },
      { model: 'model3', brand: 'brand3', description: 'description3' },
    ];
    element = angular.element('<div service-request-form model="model" clients="clients" devices="devices"></div>')
    $compile(element)(scope);
    scope.$digest();
    iScope = element.isolateScope();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should add an asterisk to the required fields', inject(function ($compile) {
    expect(element.find('.fa-asterisk').length).toEqual(5);
  }));

  it('should start with no accessories in the model', function(){
    expect(scope.model.accessories.length).toEqual(0);
  });
});