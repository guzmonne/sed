'use strict';

describe('Filter: objLimitTo', function () {

  // load the filter's module
  beforeEach(module('sedApp'));

  // initialize a new instance of the filter before each test
  var objLimitTo;
  beforeEach(inject(function ($filter) {
    objLimitTo = $filter('objLimitTo');
  }));

  it('should return the input prefixed with "objLimitTo filter:"', function () {
    var text = 'angularjs';
    expect(objLimitTo(text)).toBe('objLimitTo filter: ' + text);
  });

});
