var SyntaxTemplate = require('./syntax-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(SyntaxTemplate, {

		request: {
			$and: [
				{
					token: 'request_line'
				},
				{
					tokens: {
						$and: [
							{
								$or: [
									{
										token: 'general_header'
									},
									{
										token: 'request_header'
									},
									{
										token: 'entity_header'
									}
								]
							},
							{
								token: 'CRLF'
							}
						],
						quantifier: '*'
					}
				},
				{
					token: 'CRLF'
				},
				{
					token: 'message_body',
					quantifier: '?'
				}
			]
		},

		request_line: {
			$and: [
				{
					token: 'method'
				},
				{
					literal: 'SP'
				},
				{
					token: 'request_uri'
				},
				{
					literal: 'SP'
				},
				{
					token: 'http_version'
				},
				{
					token: 'CRLF'
				}
			]
		},

		request_uri: {
			$or: [
				{
					literal: '*'
				},
				{
					token: 'absolute_uri'
				},
				{
					token: 'abs_path'
				},
				{
					token: 'authority'
				}
			]
		},

		request_header: {
			$and: [
				{
					$or: [
						{
							literal: 'Accept'
						},
						{
							literal: 'Accept-Charset'
						},
						{
							literal: 'Accept-Encoding'
						},
						{
							literal: 'Accept-Language'
						},
						{
							literal: 'Authorization'
						},
						{
							literal: 'Expect'
						},
						{
							literal: 'From'
						},
						{
							literal: 'Host'
						},
						{
							literal: 'If-Match'
						},
						{
							literal: 'If-Modified-Since'
						},
						{
							literal: 'If-None-Match'
						},
						{
							literal: 'If-Range'
						},
						{
							literal: 'If-Unmodified-Since'
						},
						{
							literal: 'Max-Forwards'
						},
						{
							literal: 'Proxy-Authorization'
						},
						{
							literal: 'Range'
						},
						{
							// Sometimes "Refferer" depending on implementation
							literal: 'Referer'
						},
						{
							literal: 'TE'
						},
						{
							literal: 'User-Agent'
						}
					]
				},
				{
					literal: ':'
				},
				{
					token: 'field_value',
					quantifier: '?'
				}
			]
		},
		general_header: {
			$and: [
				{
					$or: [
						{
							literal: 'Cache-Control'
						},
						{
							literal: 'Connection'
						},
						{
							literal: 'Date'
						},
						{
							literal: 'Pragma'
						},
						{
							literal: 'Trailer'
						},
						{
							literal: 'Transfer-Encoding'
						},
						{
							literal: 'Upgrade'
						},
						{
							literal: 'Via'
						},
						{
							literal: 'Warning'
						}
					]
				},
				{
					literal: ':'
				},
				{
					token: 'field_value',
					quantifier: '?'
				}
			]
		},
		entity_header: {
			$and: [
				{
					$or: [
						{
							literal: 'Allow'
						},
						{
							literal: 'Content-Encoding'
						},
						{
							literal: 'Content-Language'
						},
						{
							literal: 'Content-Length'
						},
						{
							literal: 'Content-Location'
						},
						{
							literal: 'Content-MD5'
						},
						{
							literal: 'Content-Range'
						},
						{
							literal: 'Content-Type'
						},
						{
							literal: 'Expires'
						},
						{
							literal: 'Last-Modified'
						},
						{
							token: 'extension_header'
						}
					]
				},
				{
					literal: ':'
				},
				{
					token: 'field_value',
					quantifier: '?'
				}
			]
		},

		extension_header: {
			token: 'message_header'
		},

		message_header: {
			$and: [
				{
					token: 'field_name'
				},
				{
					literal: ':'
				},
				{
					token: 'field_value',
					quantifier: '?'
				}
			]
		},

		field_name: {
			token: 'token'
		},

		field_value: {
			$or: [
				{
					token: 'field_content'
				},
				{
					token: 'LWS'
				}
			],
			quantifier: '*'
		},

		method: {
			// Missing WebDAV methods as well as DEBUG and TRACK
			$or: [
				{
					literal: 'OPTIONS'
				},
				{
					literal: 'GET'
				},
				{
					literal: 'HEAD'
				},
				{
					literal: 'POST'
				},
				{
					literal: 'PUT'
				},
				{
					literal: 'DELETE'
				},
				{
					literal: 'TRACE'
				},
				{
					literal: 'CONNECT'
				},
				{
					token: 'extension_method'
				}
			]
		},

		extension_method: {
			token: 'token'
		},

		http_version: {
			$and: [
				{
					literal: 'HTTP'
				},
				{
					literal: '/'
				},
				{
					token: 'DIGIT',
					quantifier: '+'
				},
				{
					literal: '.'
				},
				{
					token: 'DIGIT',
					quantifier: '+'
				}
			]
		},

		field_content: null,
		message_body: null,

		absolute_uri: null,
		abs_path: null,
		authority: null,

		token: {
			// any CHAR except CTLs or separators
			token: 'CHAR',
			quantifier: '+'
		}

	});
});
