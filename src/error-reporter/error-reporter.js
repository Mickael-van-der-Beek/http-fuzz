var crypto = require('crypto');

module.exports = (function () {
	'use strict';

	function ErrorReporter () {}

	ErrorReporter.prototype.init = function () {
		this.responseCache = {};
		this.errorCache = {};
	};

	ErrorReporter.prototype.addError = function (request, error) {
		var errorHash = crypto
			.createHash('sha1')
			.update(
				error
					// Offset by 7 due to the auto-prepended "Error :"
					.substr(7 + new Error('Test: testy').message.length),
				'utf8'
			)
			.digest('hex');

		if (errorHash in this.errorCache) {
			return null;
		}

		this.errorCache[errorHash] = {
			request: request,
			error: error
		};

		return this.errorCache[errorHash];
	};

	ErrorReporter.prototype.addResponse = function (request, response) {
		var responseHash = crypto
			.createHash('sha1')
			.update(
				response
					.replace(/Content-Length:[^\n]+\n\r/g, '')
					.replace(/Date:[^\n]+\n\r/g, ''),
				'utf8'
			)
			.digest('hex');

		if (responseHash in this.responseCache) {
			return null;
		}

		this.responseCache[responseHash] = {
			response: response,
			request: request
		};

		return this.responseCache[responseHash];
	};

	return new ErrorReporter();
})();
