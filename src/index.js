var TemplatingEngine = require('./templating-engine/templating-engine');
var ErrorReporter = require('./error-reporter/error-reporter');

var ClientConfig = require('./config/client');
var Client = require('./client/client');

var RFC2616HttpTemplate = require('./templates/http/rfc2616-template');

module.exports = (function () {
	'use strict';

	TemplatingEngine.init();
	ErrorReporter.init();

	Client.init(ClientConfig);

	// Client.send([
	// 	'TRACE / HTTP/1.1',
	// 	'Host: httpbin.org',
	// 	'Max-Forwards: 1',
	// 	'\r\n'
	// ].join('\r\n'), function (e, response) {
	// 	console.log('> Error', e);
	// 	console.log('> Response', arguments);
	// });

	var fuzz = function () {
		var request = TemplatingEngine.render(RFC2616HttpTemplate, 'request');

		Client.send(request, function (e, response) {
			if (response) {
				var responseLog = ErrorReporter.addResponse(request, response);

				if (responseLog !== null) {
					console.log(new Array(81).join('-'));
					console.log(request);
					console.log(new Array(81).join('+'));
					console.log(response);
					console.log(new Array(81).join('-'));
				}
			}

			if (e) {
				var errorLog = ErrorReporter.addError(request, e);

				if (errorLog !== null) {
					console.log(new Array(81).join('-'));
					console.log(request);
					console.log(new Array(81).join('+'));
					console.log(e);
					console.log(new Array(81).join('-'));
				}
			}

			setTimeout(function () {
				fuzz();
			}, 1000);
		});
	};

	// process.on('SIGINT', function() {
	// 	console.log(ErrorReporter.responseCache);
	// 	console.log(ErrorReporter.errorCache);
	// 	process.exit();
	// });

	// process.on('uncaughtException', function (e) {
	// 	console.error(e);
	// 	console.error(e.stack);
	// 	console.log('\n\n');
	// 	console.log(ErrorReporter.responseCache);
	// 	console.log(ErrorReporter.errorCache);
	// 	process.exit();
	// });

	// fuzz();
})();
