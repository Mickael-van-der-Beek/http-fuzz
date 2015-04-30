var TemplatingEngine = require('./templating-engine/templating-engine');
var ErrorReporter = require('./error-reporter/error-reporter');

var RFC2616HttpTemplate = require('./templates/http/rfc2616-template');

var HTTPParser = process.binding('http_parser').HTTPParser;

module.exports = (function () {
	'use strict';

	TemplatingEngine.init();
	ErrorReporter.init();

	var fuzz = function () {
		setImmediate(function () {
			var request = new Buffer(
				TemplatingEngine.render(RFC2616HttpTemplate, 'request'),
				'utf8'
			);

			try {
				var parser = new HTTPParser(HTTPParser.REQUEST);

				parser.onHeaders = function (headers, url) {};
				parser.onBody = function () {};
				parser.onComplete = function () {};

				parser.execute(
					request, 0, request.length
				);

				parser.onHeaders = null;
				parser.onBody = null;
				parser.onComplete = null;

				parser = null;
			}
			catch (e) {
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
			}, 5);
		});
	};

	process.on('SIGINT', function() {
		console.log(ErrorReporter.responseCache);
		console.log(ErrorReporter.errorCache);
		process.exit();
	});

	process.on('uncaughtException', function (e) {
		console.error(e);
		console.error(e.stack);
		console.log('\n\n');
		console.log(ErrorReporter.responseCache);
		console.log(ErrorReporter.errorCache);
		process.exit();
	});

	fuzz();
})();
