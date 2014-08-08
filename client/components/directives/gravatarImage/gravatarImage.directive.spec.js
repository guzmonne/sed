'use strict';

describe('Directive: gravatarImage', function () {

  // load the directive's module
  beforeEach(module('sedApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gravatar-image></gravatar-image>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gravatarImage directive');
  }));
});