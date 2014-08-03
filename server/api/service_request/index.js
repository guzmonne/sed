'use strict';

var express    = require('express');
var controller = require('./service_request.controller');
var auth       = require('../../auth/auth.service');

var router = express.Router();

router.get   ('/'   , auth.isAuthenticated(), controller.index);
router.get   ('/:id', auth.isAuthenticated(), controller.show);
router.post  ('/'   , auth.isAuthenticated(), controller.create);
router.put   ('/:id', auth.isAuthenticated(), controller.update);
router.patch ('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.hasRole('admin') , controller.destroy);

module.exports = router;