var assert = require('assert')
var should = require('should')

var hello_world = require('../src/hello_world.js')


describe('Welcome', function(){
	it('should print "Hello Mark"', function(){
		hello_world.welcome('Mark').should.equal('Hello Mark');
	});
});