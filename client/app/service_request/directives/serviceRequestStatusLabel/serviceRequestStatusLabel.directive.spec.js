'use strict';

describe('Directive: serviceRequestStatusLabel', function () {

  // load the directive's module
  beforeEach(module('sedApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<service-request-status-label></service-request-status-label>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the serviceRequestStatusLabel directive');
  }));
});