'use strict';

global.rootDir = __dirname+'/..';
global.mongoUri = "";
global.zeroLeftMask = function (number, size) {
  number = number.toString();
  for(; size - number.length > 0;) number = "0" + number;
  return number;
}
global.NEEKA = {};
global.mailer = {};

Date.prototype.toString = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}
Date.prototype.toJSON = function (){return (this.getMonth()+1)+"-"+this.getDate()+"-"+this.getFullYear()}

require('../lib/setupFecha.js');
//require('../lib/checkUpdate.js');
var http = require('http'),
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
		.send({ hostname: '127.0.0.1', port: '27017', dbname: 'neeka'})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'First step');
			t.end();
		});
});

test('Testing install first step', function (t) {
	request(app)
		.post('/install/2')
		.send({ firstname: 'Daniel', email: 'danielsunami@gmail.com', password: '123'})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'Second step');
			t.end();
		});
});

test('Testing install first step', function (t) {
	request(app)
		.post('/install/3')
		.send({})
		.expect(200)
		.end(function (err, res) {
			t.error(err, 'No error');
			t.same(res.body.ok, true, 'Third step');
			t.end();
		});
});

test('Testing install first step', function (t) {
	request(app)
		.post('/install/4')
		.send({name: 'Akafrx', url: '127.0.0.1'})
		.expect(302)
		.expect('location',/\//)
		.end(function (err, res) {
			t.error(err, 'Fourth step');
			t.end();
		});
});

test('Closing db connection', function (t) {
	require('mongoose').disconnect();
	t.end();
});
