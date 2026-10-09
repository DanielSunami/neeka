'use strict';

global.rootDir = __dirname+'/..';
global.zeroLeftMask = function (n) {
  n = parseInt(n, 10);
  return (n < 10 ? '0' : '') + n;
}
global.NEEKA = {};
global.mailer = {};

Date.prototype.toString = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}
Date.prototype.toJSON = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}

require('../lib/setupFecha.js');
require('../lib/permissions.js');
//require('../lib/checkUpdate.js');
let http = require('http'),
	app = require('../lib/app.js'),
	test = require('tape'),
	tapSpec = require('tap-spec'),
	request = require('supertest');

test.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

test('Testing / before install', function (t) {
  request(app)
    .get('/')
    .expect(200)
    .end(function (err, res) {
		t.error(err, 'No error');
		t.same(res.text, 'Nothing here...', 'Message as expected');
		t.end();
    });
});  

test('Testing /install', function (t) {
	request(app)
		.get('/install')
		.expect(200)
		.expect('content-type',/text\/html/)
		.end(function (err, res) {
			t.error(err, 'Install page loaded!');
			t.end();
		});
});

test('Testing install first step', function (t) {
	request(app)
		.post('/install/1')
		.send({ firstname: 'Daniel', email: 'danielsunami@gmail.com', password: '123'})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'First step');
			t.end();
		});
});

test('Testing install second step', function (t) {
	request(app)
		.post('/install/2')
		.send({})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'Second step');
			t.end();
		});
});

test('Testing install third step', function (t) {
	request(app)
		.post('/install/3')
		.send({name: 'Akafrx', url: '127.0.0.1'})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'Third step');
			t.end();
		});
});

test('Closing db connection', function (t) {
	require('../lib/sqlite').close();
	t.end();
});
