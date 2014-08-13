'use strict';

describe('Directive: modelHistory', function () {

  // load the directive's module and view
  beforeEach(module('sedApp'));
  beforeEach(module('components/directives/modelHistory/modelHistory.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<model-history></model-history>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the modelHistory directive');
  }));
});