var RFC822FormatTemplate = require('../format/rfc822-template');
var RFC3986UriTemplate = require('../uri/rfc3986-template');
var RFC2617HttpTemplate = require('./rfc2617-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, RFC3986UriTemplate, RFC2617HttpTemplate, {

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
			$or: [
				{
					token: 'accept'
				},
				{
					token: 'accept_charset'
				},
				{
					token: 'accept_encoding'
				},
				{
					token: 'accept_language'
				},
				{
					token: 'Authorization'
				},
				{
					token: 'expect'
				},
				{
					token: 'from'
				},
				{
					token: 'host_header'
				},
				{
					token: 'if_match'
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

		/**
		 * name: Accept
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.1
		 */
		accept: {
			$and: [
				{
					literal: 'Accept'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							token: 'media_range'
						},
						{
							token: 'accept_params',
							quantifier: '#'
						}
					]
				}
			]
		},

		/**
		 * name: media-range
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.1
		 */
		media_range: {
			$and: [
				{
					$or: [
						{
							literal: '*/*'
						},
						{
							$and: [
								{
									token: 'type'
								},
								{
									literal: '/'
								},
								{
									literal: '*'
								}
							]
						},
						{
							$and: [
								{
									token: 'type'
								},
								{
									literal: '/'
								},
								{
									token: 'subtype'
								}
							]
						}
					]
				},
				{
					$and: [
						{
							literal: ';'
						},
						{
							token: 'parameter'
						}
					],
					quantifier: '*'
				}
			]
		},

		/**
		 * name: accept-params
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.1
		 */
		accept_params: {
			$and: [
				{
					literal: ';'
				},
				{
					literal: 'q'
				},
				{
					literal: '='
				},
				{
					token: 'qvalue'
				},
				{
					token: 'accept_extension',
					quantifier: '*'
				}
			]
		},

		/**
		 * name: accept-extension
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.1
		 */
		accept_extension: {
			$and: [
				{
					literal: ';'
				},
				{
					token: 'token'
				},
				{
					$and: [
						{
							literal: '='
						},
						{
							$or: [
								{
									token: 'token'
								},
								{
									token: 'quoted_string'
								}
							]
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: qvalue
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.9
		 */
		qvalue: {
			$or: [
				{
					$and: [
						{
							literal: '0'
						},
						{
							$and: [
								{
									literal: '.'
								},
								{
									token: 'DIGIT',
									quantifier: '0*3'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					$and: [
						{
							literal: '1'
						},
						{
							$and: [
								{
									literal: '.'
								},
								{
									literal: '0',
									quantifier: '0*3'
								}
							],
							quantifier: '?'
						}
					]
				}
			]
		},

		/**
		 * name: type
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.9
		 */
		type: {
			// TODO: Replace this by a list of valid MIME types
			token: 'token'
		},

		/**
		 * name: sub-type
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.9
		 */
		sub_type: {
			// TODO: Replace this by a list of valid MIME sub-types
			token: 'token'
		},

		/**
		 * name: Accept-Charset
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.2
		 */
		accept_charset: {
			$and: [
				{
					literal: 'Accept-Charset'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							$or: [
								{
									token: 'charset'
								},
								{
									literal: '*'
								}
							]
						},
						{
							$and: [
								{
									literal: ';'
								},
								{
									literal: 'q'
								},
								{
									literal: '='
								},
								{
									token: 'qvalue'
								}
							],
							quantifier: '?'
						}
					],
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: charset
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.2
		 */
		charset: {
			token: 'token'
		},

		/**
		 * name: Accept-Encoding
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.3
		 */
		accept_encoding: {
			$and: [
				{
					literal: 'Accept-Encoding'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							token: 'codings'
						},
						{
							$and: [
								{
									literal: ';'
								},
								{
									literal: 'q'
								},
								{
									literal: '='
								},
								{
									token: 'qvalue'
								}
							],
							quantifier: '?'
						}
					],
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: codings
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.3
		 */
		codings: {
			$and: [
				{
					token: 'content_coding'
				},
				{
					literal: '*'
				}
			]
		},

		/**
		 * name: content_coding
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.5
		 */
		content_coding: {
			// TODO: Replace this by a list of valid encoding methods like gzip and deflate
			token: 'token'
		},

		/**
		 * name: Accept-Language
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.4
		 */
		accept_language: {
			$and: [
				{
					literal: 'Accept-Language'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							token: 'language_range'
						},
						{
							$and: [
								{
									literal: ';'
								},
								{
									literal: 'q'
								},
								{
									literal: '='
								},
								{
									token: 'qvalue'
								}
							],
							quantifier: '?'
						}
					],
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: language-range
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.4
		 */
		language_range: {
			$or: [
				{
					$and: [
						{
							token: 'ALPHA',
							quantifier: '1*8'
						},
						{
							$and: [
								{
									literal: '-'
								},
								{
									token: 'ALPHA',
									quantifier: '1*8'
								}
							],
							quantifier: '*'
						}
					]
				},
				{
					literal: '*'
				}
			]
		},

		/**
		 * name: Authorization
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.8
		 */
		authorization: {
			$and: [
				{
					literal: 'Authorization'
				},
				{
					literal: ':'
				},
				{
					token: 'credentials'
				}
			]
		},

		/**
		 * name: Expect
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.20
		 */
		expect: {
			$and: [
				{
					literal: 'Expect'
				},
				{
					literal: ':'
				},
				{
					token: 'expectation',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: From
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.22
		 */
		from: {
			$and: [
				{
					literal: 'From'
				},
				{
					literal: ':'
				},
				{
					token: 'mailbox'
				}
			]
		},

		/**
		 * name: expectation
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.20
		 */
		expectation: {
			$or: [
				{
					literal: '100-continue'
				},
				{
					token: 'expectation_extension'
				}
			]
		},

		/**
		 * name: expectation-extension
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.20
		 */
		expectation_extension: {
			$and: [
				{
					token: 'token'
				},
				{
					$and: [
						{
							literal: '='
						},
						{
							$or: [
								{
									token: 'token'
								},
								{
									token: 'quoted_string'
								}
							]
						},
						{
							token: 'expect_params',
							quantifier: '*'
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: expect-params
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.20
		 */
		expect_params: {
			$and: [
				{
					literal: ';'
				},
				{
					token: 'token'
				},
				{
					$and: [
						{
							literal: '='
						},
						{
							$or: [
								{
									token: 'token'
								},
								{
									token: 'quoted_string'
								}
							]
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: Host
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.23
		 *
		 * notes: Key was renamed from "host" to "host_header" to prevent a
		 * collision with the RFC3986 URI spec
		 */
		host_header: {
			$and: [
				{
					literal: 'Host'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							token: 'host'
						},
						{
							$or: [
								{
									literal: ':'
								},
								{
									token: 'port'
								}
							]
						}
					]
				}
			]
		},

		/**
		 * name: If-Match
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.24
		 */
		if_match: {
			$and: [
				{
					literal: 'If-Match'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							literal: '*'
						},
						{
							token: 'entity_tag',
							quantifier: '1#'
						}
					]
				}
			]
		},

		/**
		 * name: entity-tag
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.11
		 */
		entity_tag: {
			$and: [
				{
					token: 'weak',
					quantifier: '?'
				},
				{
					token: 'opaque-tag'
				}
			]
		},

		/**
		 * name: weak
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.11
		 */
		weak: {
			$and: [
				{
					literal: 'W'
				},
				{
					literal: '/'
				}
			]
		},

		/**
		 * name: opaque-tag
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.11
		 */
		opaque_tag: {
			token: 'quoted-string'
		},

		/**
		 * name: If-Modified-Since
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.25
		 */
		if_modified_since: {
			$and: [
				{
					literal: 'If-Modified-Since'
				},
				{
					literal: ':'
				},
				{
					token: 'http_date'
				}
			]
		},

		/**
		 * name: HTTP-date
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		http_date: {
			$or: [
				{
					token: 'rfc1123_date'
				},
				{
					token: 'rfc850_date'
				},
				{
					token: 'asctime_date'
				}
			]
		},

		/**
		 * name: rfc1123-date
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		rfc1123_date: {
			$and: [
				{
					token: 'wkday'
				},
				{
					literal: ','
				},
				{
					token: 'SP'
				},
				{
					token: 'date1'
				},
				{
					token: 'SP'
				},
				{
					token: 'time'
				},
				{
					token: 'SP'
				},
				{
					literal: 'GMT'
				}
			]
		},

		/**
		 * name: rfc850-date
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		rfc850_date: {
			$and: [
				{
					token: 'weekday'
				},
				{
					literal: ','
				},
				{
					token: 'SP'
				},
				{
					token: 'date2'
				},
				{
					token: 'SP'
				},
				{
					token: 'time'
				},
				{
					token: 'SP'
				},
				{
					literal: 'GMT'
				}
			]
		},

		/**
		 * name: asctime-date
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		asctime_date: {
			$and: [
				{
					token: 'wkday'
				},
				{
					token: 'SP'
				},
				{
					token: 'date3'
				},
				{
					token: 'SP'
				},
				{
					token: 'time'
				},
				{
					token: 'SP'
				},
				{
					token: 'DIGIT',
					quantifier: '4'
				}
			]
		},

		/**
		 * name: date1
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		date1: {
			$and: [
				{
					token: 'DIGIT',
					quantifier: '2'
				},
				{
					token: 'SP'
				},
				{
					token: 'month'
				},
				{
					token: 'SP'
				},
				{
					token: 'DIGIT',
					quantifier: '4'
				}
			]
		},

		/**
		 * name: date2
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		date2: {
			$and: [
				{
					token: 'DIGIT',
					quantifier: '2'
				},
				{
					literal: '-'
				},
				{
					token: 'month'
				},
				{
					literal: '-'
				},
				{
					token: 'DIGIT',
					quantifier: '2'
				}
			]
		},

		/**
		 * name: date3
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		date3: {
			$and: [
				{
					token: 'month'
				},
				{
					token: 'SP'
				},
				{
					$or: [
						{
							token: 'DIGIT',
							quantifier: '2'
						},
						{
							$and: [
								{
									token: 'SP'
								},
								{
									token: 'DIGIT',
									quantifier: '1'
								}
							]
						}
					]
				}
			]
		},

		/**
		 * name: time
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		time: {
			$and: [
				{
					token: 'DIGIT',
					quantifier: '2'
				},
				{
					literal: ':'
				},
				{
					token: 'DIGIT',
					quantifier: '2'
				},
				{
					literal: ':'
				},
				{
					token: 'DIGIT',
					quantifier: '2'
				}
			]
		},

		/**
		 * name: wkday
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		wkday: {
			$or: [
				{
					literal: 'Mon'
				},
				{
					literal: 'Tue'
				},
				{
					literal: 'Wed'
				},
				{
					literal: 'Thu'
				},
				{
					literal: 'Fri'
				},
				{
					literal: 'Sat'
				},
				{
					literal: 'Sun'
				}
			]
		},

		/**
		 * name: weekday
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		weekday: {
			$or: [
				{
					literal: 'Monday'
				},
				{
					literal: 'Tuesday'
				},
				{
					literal: 'Wednesday'
				},
				{
					literal: 'Thursday'
				},
				{
					literal: 'Friday'
				},
				{
					literal: 'Saturday'
				},
				{
					literal: 'Sunday'
				}
			]
		},

		/**
		 * name: month
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.1
		 */
		month: {
			$or: [
				{
					literal: 'Jan'
				},
				{
					literal: 'Feb'
				},
				{
					literal: 'Mar'
				},
				{
					literal: 'Apr'
				},
				{
					literal: 'May'
				},
				{
					literal: 'Jun'
				},
				{
					literal: 'Jul'
				},
				{
					literal: 'Aug'
				},
				{
					literal: 'Sep'
				},
				{
					literal: 'Oct'
				},
				{
					literal: 'Nov'
				},
				{
					literal: 'Dec'
				}
			]
		},

		/**
		 * name: If-None-Match
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.26
		 */
		if_none_match: {
			$and: [
				{
					literal: 'If-None-Match'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							literal: '*'
						},
						{
							token: 'entity-tag',
							quantifier: '1#'
						}
					]
				}
			]
		},

		/**
		 * name: If-Range
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.27
		 */
		if_range: {
			$and: [
				{
					literal: 'If-Range'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							token: 'entity-tag'
						},
						{
							token: 'http-date'
						}
					]
				}
			]
		},

		/**
		 * name: If-Unmodified-Since
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.28
		 */
		if_unmodified_since: {
			$and: [
				{
					literal: 'If-Unmodified-Since'
				},
				{
					literal: ':'
				},
				{
					token: 'http-date'
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
