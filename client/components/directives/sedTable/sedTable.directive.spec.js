'use strict';

describe('Directive: sedTable', function () {

  // load the directive's module
  beforeEach(module('sedApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sed-table></sed-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sedTable directive');
  }));
});