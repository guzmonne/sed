'use strict';

/*global describe */
/*global it */
/*global before */

var should = require('should');
var _      = require('lodash');
var async  = require('async');
var sinon  = require('sinon');
var helper = require('./controller.helper');
var User   = require('../api/user/user.model');

var req, user;

function Req(body, user){
	this.body = body;
	this.user = user;
}

describe('Controller Helper', function(){

	before(function(done){
		User.remove({ name: 'Controller Helper User' }, function(err){
			if (err) { return done(err); }
			user = new User({
				name    : 'Controller Helper User', 
				email   : 'controller.helper.user@test.com',
				password: 'test'
			});
			user.save(function(err){
				if (err) { return done(err); }
				done();
			});
		});
	});

	it('should exist only one user named "Controller Helper User"', function(done){
		User.find({ name: 'Controller Helper User' }, function(err, collection){
			if (err) { return done(err); }
			collection.should.have.length(1);
			done();
		});
	});

	describe('addUser(req: Object)', function(){

		it('should throw an error if req.body is not an object', function(){
			req = new Req("error", user);
			(function(){ helper.addUser(req); }).should.throw('"req.body" must be an object');
		});
		it('should throw an error if req.user is not an object', function(){
			req = new Req({}, "error");
			(function(){ helper.addUser(req); }).should.throw('"req.user" must be an object');
		});
		it('should throw an error if req.user._id is undefined', function(){
			req = new Req({}, {});
			(function(){ helper.addUser(req); }).should.throw('"req.user._id" is undefined');
		});
		it('should add the current user _id to "createdAt" if its undefined', function(){
			req = new Req({}, user);
			helper.addUser(req);
			req.body.createdBy.should.equal(user._id);
		});
		it('should not add the current user _id to "createdAt" if its defined', function(){
			req = new Req({createdBy: '123'}, user);
			helper.addUser(req);
			req.body.createdBy.should.equal('123');
		});
		it('should add the current user _id to "updatedAt"', function(){
			req = new Req({createdBy: '123'}, user);
			helper.addUser(req);
			req.body.updatedBy.should.equal(user._id);
		});

	});

	describe('justIds(req: Object)', function(){
	
		it('should left just the "_device" _id if its an object', function(){
			req = new Req({ _device: { _id: '123' } }, user);
			helper.justIds(req);
			req.body._device.should.equal('123');
		});
		it('should left just the "_client" _id if its an object', function(){
			req = new Req({ _client: { _id: '123' } }, user);
			helper.justIds(req);
			req.body._client.should.equal('123');
		});
		it('should left just the "_technician" _id if its an object', function(){
			req = new Req({ _technician: { _id: '123' } }, user);
			helper.justIds(req);
			req.body._technician.should.equal('123');
		});
	
	});

	describe('removeUnwantedAttrs(req: Object)', function(){

		it('should remove the "createdBy" attribute if defined on the req.body', function(){
			req = new Req({ createdBy: '123' }, user);
			helper.removeUnwantedAttrs(req);
			(req.body.createdBy === undefined).should.be.true;
		});
		it('should remove the "createdAt" attribute if defined on the req.body', function(){
			req = new Req({ createdAt: '123' }, user);
			helper.removeUnwantedAttrs(req);
			(req.body.createdAt === undefined).should.be.true;
		});
		it('should remove the "updatedBy" attribute if defined on the req.body', function(){
			req = new Req({ updatedBy: '123' }, user);
			helper.removeUnwantedAttrs(req);
			(req.body.updatedBy === undefined).should.be.true;
		});
		it('should remove the "updatedBy" attribute if defined on the req.body', function(){
			req = new Req({ createdAt: '123' }, user);
			helper.removeUnwantedAttrs(req);
			(req.body.createdAt === undefined).should.be.true;
		});

	});

	describe('setBody(req: Object)', function(){

		before(function(){
			req = new Req({}, user);
		});

		it('should call "addUser"', function(){
			sinon.spy(helper, 'addUser');
			helper.setBody(req);
			helper.addUser.should.be.calledOnce;
		});
		it('should call "justIds"', function(){
			sinon.spy(helper, 'justIds');
			helper.setBody(req);
			helper.justIds.should.be.calledOnce;
		});
		it('should call "removeUnwantedAttrs"', function(){
			sinon.spy(helper, 'removeUnwantedAttrs');
			helper.setBody(req);
			helper.removeUnwantedAttrs.should.be.calledOnce;
		});

	});
});