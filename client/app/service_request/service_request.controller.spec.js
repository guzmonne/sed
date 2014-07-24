'use strict';

describe('Controller: ServiceRequestCtrl', function () {

  // load the controller's module
  beforeEach(module('sedApp'));

  var ServiceRequestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServiceRequestCtrl = $controller('ServiceRequestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
