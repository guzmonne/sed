'use strict';

describe('Directive: clientTable', function () {

  // load the directive's module and view
  beforeEach(module('sedApp'));
  beforeEach(module('app/client/directives/clientTable/clientTable.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<client-table></client-table>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the clientTable directive');
  }));
});