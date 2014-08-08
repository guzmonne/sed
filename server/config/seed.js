/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var User = require('../api/user/user.model');

User.find(function(err, collection){
  if (err){ return console.log(err); }
  if (collection.length > 0) { return; }
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    name: 'Guzmán Monné',
    role: 'admin',
    email: 'guzmonne@hotmail.com',
    password: 'example'
  }, function() {
      console.log('finished populating users');
    }
  );
});