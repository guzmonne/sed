'use strict';

describe('Controller: ClientnewCtrl', function () {

  // load the controller's module
  beforeEach(module('sedApp'));

  var ClientnewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientnewCtrl = $controller('ClientnewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
