'use strict';

describe('Filter: objectAsArray', function () {

  // load the filter's module
  beforeEach(module('sedApp'));

  // initialize a new instance of the filter before each test
  var objectAsArray;
  beforeEach(inject(function ($filter) {
    objectAsArray = $filter('objectAsArray');
  }));

  it('should return the input prefixed with "objectAsArray filter:"', function () {
    var text = 'angularjs';
    expect(objectAsArray(text)).toBe('objectAsArray filter: ' + text);
  });

});
