'use strict';

describe('Service: Sync', function () {

  // load the service's module
  beforeEach(module('sedApp'));

  // instantiate service
  var Sync;
  beforeEach(inject(function (_Sync_) {
    Sync = _Sync_;
  }));

  it('should do something', function () {
    expect(!!Sync).toBe(true);
  });

});
