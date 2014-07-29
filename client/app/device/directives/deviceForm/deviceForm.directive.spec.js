'use strict';

describe('Directive: deviceForm', function () {

  // load the directive's module and view
  beforeEach(module('sedApp'));
  beforeEach(module('app/device/directives/deviceForm/deviceForm.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<device-form></device-form>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the deviceForm directive');
  }));
});