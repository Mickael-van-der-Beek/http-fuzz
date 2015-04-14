var TemplatingEngine = require('./templating-engine/templating-engine');
var RequestTemplate = require('./templates/request-template');

var ClientConfig = require('./config/client');
var Client = require('./client/client');

var assert = require('assert');

module.exports = (function () {
	'use strict';

	TemplatingEngine.init({});
	Client.init(ClientConfig);

	var responseHashMap = {};
	var errorHashMap = {};

	var fuzz = function fuzz () {
		var request = TemplatingEngine.render(RequestTemplate, 'request');

		Client.send(request, function (e, response) {
			if (response) {
				if (typeof response !== 'string') {
					console.log(new Array(81).join('-'));
					console.log(request);
					console.log(new Array(41).join('+'));
					console.log(response);
					console.log(new Array(81).join('-'));				
				}
				else {
					var responseHash = require('crypto')
						.createHash('sha1')
						.update(
							response
								.replace(/Content-Length:[^\n]+\n/, '')
								.replace(/Date:[^\n]+\n/, ''),
							'utf8'
						)
						.digest('hex');

					if (!(responseHash in responseHashMap)) {
						responseHashMap[responseHash] = {
							request: request,
							response: response
						};
						console.log(new Array(81).join('-'));
						console.log(request);
						console.log(new Array(41).join('+'));
						console.log(response);
						console.log(new Array(81).join('-'));
					}
				}
			}

			if (e) {
				var errorHash = require('crypto')
					.createHash('sha1')
					.update(
						e.stack,
						'utf8'
					)
					.digest('hex');

				if (!(errorHash in errorHashMap)) {
					errorHashMap[errorHash] = {
						request: request,
						error: e
					};
					console.log(new Array(81).join('-'));
					console.log(request);
					console.log(new Array(41).join('+'));
					console.log(e);
					console.log(new Array(81).join('-'));
				}
			}

			setTimeout(function () {
				fuzz();
			}, 1000 * 3);
		});
	};

	process.on('SIGINT', function() {
		console.log(responseHashMap);
		console.log(errorHashMap);
		process.exit();
	});

	process.on('uncaughtException', function() {
		console.log(responseHashMap);
		console.log(errorHashMap);
		process.exit();
	});

	fuzz();
})();
