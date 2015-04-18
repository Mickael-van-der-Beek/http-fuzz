var RFC822FormatTemplate = require('../format/rfc822-template');
var RFC3986UriTemplate = require('../uri/rfc3986-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, RFC3986UriTemplate, {

		/**
		 * name: Request
		 * ref: https://tools.ietf.org/html/rfc2616#section-5
		 */
		request: {
			$and: [
				{
					token: 'request_line'
				},
				{
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

		/**
		 * name: Request-Line
		 * ref: https://tools.ietf.org/html/rfc2616#section-5.1
		 */
		request_line: {
			$and: [
				{
					token: 'method'
				},
				{
					token: 'SP'
				},
				{
					token: 'request_uri'
				},
				{
					token: 'SP'
				},
				{
					token: 'http_version'
				},
				{
					token: 'CRLF'
				}
			]
		},

		/**
		 * name: Request-URI
		 * ref: https://tools.ietf.org/html/rfc2616#section-5.1.2
		 */
		request_uri: {
			$or: [
				{
					literal: '*'
				},
				{
					token: 'absolute_uri'
				},
				{
					/**
					 * Spec says name is: abs_path
					 * but: http://tools.ietf.org/html/rfc3986#appendix-D.2
					 * overrides it with a new name: path-absolute
					 */
					token: 'path_absolute'
				},
				{
					token: 'authority'
				}
			]
		},

		/**
		 * name: request-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-5.3
		 */
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

		/**
		 * name: general-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.5
		 */
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

		/**
		 * name: entity-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-7.1
		 */
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

		/**
		 * name: extension-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-7.1
		 */
		extension_header: {
			token: 'message_header'
		},

		/**
		 * name: message-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.2
		 */
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

		/**
		 * name: field-name
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.2
		 */
		field_name: {
			token: 'token'
		},

		/**
		 * name: field-value
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.2
		 */
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

		/**
		 * name: method
		 * ref: https://tools.ietf.org/html/rfc2616#section-5.1.1
		 */
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

		/**
		 * name: extension-method
		 * ref: https://tools.ietf.org/html/rfc2616#section-5.1.1
		 */
		extension_method: {
			token: 'token'
		},

		/**
		 * name: HTTP-Version
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.1
		 */
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

		/**
		 * name: token
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		token: {
			// any CHAR except CTLs or separators
			token: 'CHAR',
			quantifier: '+'
		},

		/**
		 * name: LWS
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		LWS: {
			$and: [
				{
					token: 'CRLF',
					quantifier: '?'
				},
				{
					$and: [
						{
							token: 'SP'
						},
						{
							token: 'HT'
						}
					],
					quantifier: '+'
				}
			]
		},

		/**
		 * name: SP
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		SP: {
			literal: ' '
		},

		/**
		 * name: separators
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		separators: {
			$or: [
				{
					literal: '('
				},
				{
					literal: ')'
				},
				{
					literal: '<'
				},
				{
					literal: '>'
				},
				{
					literal: '@'
				},
				{
					literal: ','
				},
				{
					literal: ';'
				},
				{
					literal: ':'
				},
				{
					literal: '\\'
				},
				{
					literal: '"'
				},
				{
					literal: '/'
				},
				{
					literal: '['
				},
				{
					literal: ']'
				},
				{
					literal: '?'
				},
				{
					literal: '='
				},
				{
					literal: '{'
				},
				{
					literal: '}'
				},
				{
					token: 'SP'
				},
				{
					token: 'HT'
				}
			]
		},

		/**
		 * name: field-content
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.2
		 */
		field_content: {
			// The official definition is more complex but this is a temporary placeholder
			token: 'OCTET',
			quantifier: '*'
		},

		/**
		 * name: message-body
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.3
		 */
		message_body: {
			token: 'entity_body'
		},

		/**
		 * name: entity-body
		 * ref: https://tools.ietf.org/html/rfc2616#section-7.2
		 *
		 * Missing middleware:
		 * https://tools.ietf.org/html/rfc2616#section-7.2.1
		 * https://tools.ietf.org/html/rfc2616#section-7.2.2
		 */
		entity_body: {
			token: 'OCTET',
			quantifier: '*'
		},

		/**
		 * name: OCTET
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		OCTET: {
			$or: Array.apply(
					null,
					new Array(256)
				)
				.map(function (item, index) {
					return {
						literal: new Buffer([ index ]).toString('utf8')
					};
				})
		}

	});
})();
