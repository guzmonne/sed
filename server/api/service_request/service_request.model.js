'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ServiceRequestSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);