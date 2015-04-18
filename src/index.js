var TemplatingEngine = require('./templating-engine/templating-engine');
var RFC2616HttpTemplate = require('./templates/http/rfc2616-template');

var ClientConfig = require('./config/client');
var Client = require('./client/client');

var assert = require('assert');

module.exports = (function () {
	'use strict';

	Client.init(ClientConfig);

	TemplatingEngine.init({});

	// TemplatingEngine.addMiddleware('general_header', function (template, token) {
	// 	return 'LOOOOOOOOOOL';
	// });

	// Client.send('GET * HTTP/7699.8650\r\nAccept:\s\t\s\t\s\t\r\n\r\n\r\n', function () {
	// 	console.log(arguments);
	// });

	var responseHashMap = {};
	var errorHashMap = {};

	var fuzz = function fuzz () {
		var request = TemplatingEngine.render(RFC2616HttpTemplate, 'request');

		Client.send(request, function (e, response) {
			if (response) {
				if (typeof response !== 'string') {
					responseHashMap.EMPTY = {
						request: request,
						response: response
					};
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

	// process.on('SIGINT', function() {
	// 	console.log(responseHashMap);
	// 	console.log(errorHashMap);
	// 	process.exit();
	// });

	// process.on('uncaughtException', function() {
	// 	console.log(responseHashMap);
	// 	console.log(errorHashMap);
	// 	process.exit();
	// });

	fuzz();
})();
