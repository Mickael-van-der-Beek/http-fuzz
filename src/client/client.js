var net = require('net');

module.exports = (function () {
	'use strict';

	function Client () {}

	Client.prototype.init = function (config) {
		config = config || {};

		this.timeout = config.timeout;

		this.host = config.host;
		this.port = config.port;
	};

	Client.prototype.send = function (body, callback) {
		var chunks = [];
		var error = null;

		var socket = net
			.connect({
				allowHalfOpen: false,
				host: this.host,
				port: this.port
			});

		socket
			.on('data', function (chunk) {
				chunks.push(
					chunk.toString('utf8')
				);
			})
			.on('end', function () {
				chunks = chunks.join('');
			})
			.on('lookup', function (e) {
				error = e;
				error.type = 'DNS';
			})
			.on('error', function (e) {
				error = e;
				error.type = 'NET';
			})
			.on('timeout', function () {
				error = new Error(
					'Client: Socket timeout'
				);
				error.type = 'TIMEOUT';
			})
			.on('close', function (had_error) {
				if (had_error === true && error === null) {
					error = new Error(
						'Client: Socket closed with error without returning it'
					);
					error.type = 'NO_ERROR';
				}

				socket.destroy();

				callback(error, chunks);
			});

		socket.setKeepAlive(false);
		socket.setNoDelay(true);
		socket.setTimeout(this.timeout);

		socket.end(body);
	};

	return new Client ();
})();
