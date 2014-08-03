'use strict';

describe('Directive: clientDetailsList', function () {

  // load the directive's module and view
  beforeEach(module('sedApp'));
  beforeEach(module('app/client/directives/clientDetailsList/clientDetailsList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<client-details-list></client-details-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the clientDetailsList directive');
  }));
});