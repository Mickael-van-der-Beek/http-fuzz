var RFC822FormatTemplate = require('../format/rfc822-template');
var RFC3986UriTemplate = require('../uri/rfc3986-template');
var RFC2617HttpTemplate = require('./rfc2617-template');
var RFC7233HttpTemplate = require('./rfc7233-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, RFC3986UriTemplate, RFC2617HttpTemplate, RFC7233HttpTemplate, {

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
					token: 'authorization'
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
					token: 'if_modified_since'
				},
				{
					token: 'if_none_match'
				},
				{
					token: 'if_range'
				},
				{
					token: 'if_unmodified_since'
				},
				{
					token: 'max_forwards'
				},
				{
					token: 'proxy_authorization'
				},
				{
					token: 'range'
				},
				{
					// Sometimes "Refferer" depending on implementation
					token: 'referer'
				},
				{
					token: 'te'
				},
				{
					token: 'user_agent'
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
		subtype: {
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
					token: 'opaque_tag'
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
			token: 'quoted_string'
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
							token: 'entity_tag',
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
							token: 'entity_tag'
						},
						{
							token: 'http_date'
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
					token: 'http_date'
				}
			]
		},

		/**
		 * name: Max-Forwards
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.31
		 */
		max_forwards: {
			$and: [
				{
					literal: 'Max-Forwards'
				},
				{
					literal: ':'
				},
				{
					token: 'DIGIT',
					quantifier: '1*'
				}
			]
		},

		/**
		 * name: Proxy-Authorization
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.34
		 */
		proxy_authorization: {
			$and: [
				{
					literal: 'Proxy-Authorization'
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
		 * name: Range
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.35
		 */
		range: {
			$and: [
				{
					literal: 'Range'
				},
				{
					literal: ':'
				},
				{
					token: 'range_specifier'
				}
			]
		},

		/**
		 * name: Referer
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.36
		 */
		referer: {
			$and: [
				{
					literal: 'Referer'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							token: 'absolute_uri'
						},
						{
							token: 'relative_uri'
						}
					]
				}
			]
		},

		/**
		 * name: TE
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.39
		 */
		te: {
			$and: [
				{
					literal: 'TE'
				},
				{
					literal: ':'
				},
				{
					token: 't_codings',
					quantifier: '#'
				}
			]
		},

		/**
		 * name: t-codings
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.39
		 */
		t_codings: {
			$or: [
				{
					literal: 'trailers'
				},
				{
					$and: [
						{
							token: 'transfer_extension'
						},
						{
							token: 'accept_params',
							quantifier: '?'
						}
					]
				}
			]
		},

		/**
		 * name: User-Agent
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.43
		 */
		user_agent: {
			$and: [
				{
					literal: 'User-Agent'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							token: 'product'
						},
						{
							token: 'comment'
						}
					],
					quantifier: '1*'
				}
			]
		},

		/**
		 * name: product
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.8
		 */
		product: {
			$and: [
				{
					token: 'token'
				},
				{
					$and: [
						{
							literal: '/'
						},
						{
							token: 'product_version'
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: product-version
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.8
		 */
		product_version: {
			token: 'token'
		},

		/**
		 * name: comment
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 */
		comment: {
			$and: [
				{
					literal: '('
				},
				{
					$and: [
						{
							token: 'ctext'
						},
						{
							token: 'quoted_pair'
						},
						{
							// This is a circular reference which could become an issue
							token: 'comment'
						}
					],
					quantifier: '*'
				},
				{
					literal: ')'
				}
			]
		},

		/**
		 * name: ctext
		 * ref: https://tools.ietf.org/html/rfc2616#section-2.2
		 * notes: TODO
		 */
		ctext: {
			token: 'qtext'
		},

		/**
		 * name: general-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-4.5
		 */
		general_header: {
			$or: [
				{
					token: 'cache_control'
				},
				{
					token: 'connection'
				},
				{
					token: 'date'
				},
				{
					token: 'pragma'
				},
				{
					token: 'trailer'
				},
				{
					token: 'transfer_encoding'
				},
				{
					token: 'upgrade'
				},
				{
					token: 'via'
				},
				{
					token: 'warning'
				}
			]
		},

		/**
		 * name: Cache-Control
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.9
		 */
		cache_control: {
			$and: [
				{
					literal: 'Cache-Control'
				},
				{
					literal: ':'
				},
				{
					token: 'cache_directive',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: cache-directive
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.9
		 */
		cache_directive: {
			$or: [
				{
					token: 'cache_request_directive'
				},
				{
					token: 'cache_response_directive'
				}
			]
		},

		/**
		 * name: cache-request-directive
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.9
		 */
		cache_request_directive: {
			$or: [
				{
					literal: 'no-cache'
				},
				{
					literal: 'no-store'
				},
				{
					$and: [
						{
							literal: 'max-age'
						},
						{
							literal: '='
						},
						{
							token: 'delta_seconds'
						}
					]
				},
				{
					$and: [
						{
							literal: 'max-stale'
						},
						{
							$and: [
								{
									literal: '='
								},
								{
									token: 'delta_seconds'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					$and: [
						{
							literal: 'min-fresh'
						},
						{
							literal: '='
						},
						{
							token: 'delta_seconds'
						}
					]
				},
				{
					literal: 'no-transform'
				},
				{
					literal: 'only-if-cached'
				},
				{
					token: 'cache_extension'
				}
			]
		},

		/**
		 * name: cache-extension
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.9
		 */
		cache_extension: {
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
						}
					]
				}
			]
		},

		/**
		 * name: cache-response-directive
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.9
		 */
		cache_response_directive: {
			$or: [
				{
					literal: 'public'
				},
				{
					$and: [
						{
							literal: 'private'
						},
						{
							$and: [
								{
									literal: '='
								},
								{
									literal: '"'
								},
								{
									token: 'field_name',
									quantifier: '1#'
								},
								{
									literal: '"'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					$and: [
						{
							literal: 'no-cache'
						},
						{
							$and: [
								{
									literal: '='
								},
								{
									literal: '"'
								},
								{
									token: 'field_name',
									quantifier: '1#'
								},
								{
									literal: '"'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					literal: 'no-store'
				},
				{
					literal: 'no-transform'
				},
				{
					literal: 'must-revalidate'
				},
				{
					literal: 'proxy-revalidate'
				},
				{
					$and: [
						{
							literal: 'max-age'
						},
						{
							literal: '='
						},
						{
							token: 'delta_seconds'
						}
					]
				},
				{
					$and: [
						{
							literal: 's-maxage'
						},
						{
							literal: '='
						},
						{
							token: 'delta_seconds'
						}
					]
				},
				{
					token: 'cache_extension'
				}
			]
		},

		/**
		 * name: delta-seconds
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.3.2
		 */
		delta_seconds: {
			token: 'DIGIT',
			quantifier: '1*'
		},

		/**
		 * name: Connection
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.10
		 */
		connection: {
			$and: [
				{
					literal: 'Connection'
				},
				{
					literal: ':'
				},
				{
					token: 'connection_token',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: connection-token
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.10
		 */
		connection_token: {
			token: 'token'
		},

		/**
		 * name: Date
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.18
		 */
		date: {
			$and: [
				{
					literal: 'Date'
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
		 * name: Pragma
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.32
		 */
		pragma: {
			$and: [
				{
					literal: 'Pragma'
				},
				{
					literal: ':'
				},
				{
					token: 'pragma_directive',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: pragma-directive
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.32
		 */
		pragma_directive: {
			$or: [
				{
					literal: 'no-cache'
				},
				{
					token: 'extension_pragma'
				}
			]
		},

		/**
		 * name: extension-pragma
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.32
		 */
		extension_pragma: {
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
						}
					]
				}
			]
		},

		/**
		 * name: Trailer
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.40
		 */
		trailer: {
			$and: [
				{
					literal: 'Trailer'
				},
				{
					literal: ':'
				},
				{
					token: 'field_name',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: Transfer-Encoding
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.41
		 */
		transfer_encoding: {
			$and: [
				{
					literal: 'Transfer-Encoding'
				},
				{
					literal: ':'
				},
				{
					token: 'transfer_coding',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: transfer-coding
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.6
		 */
		transfer_coding: {
			$or: [
				{
					literal: 'chunked'
				},
				{
					token: 'transfer_extension'
				}
			]
		},

		/**
		 * name: transfer-extension
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.6
		 */
		transfer_extension: {
			$and: [
				{
					token: 'token'
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
		 * name: parameter
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.6
		 */
		parameter: {
			$and: [
				{
					token: 'attribute'
				},
				{
					literal: '='
				},
				{
					token: 'value'
				}
			]
		},

		/**
		 * name: attribute
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.6
		 */
		attribute: {
			token: 'token'
		},

		/**
		 * name: value
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.6
		 */
		value: {
			$or: [
				{
					token: 'token'
				},
				{
					token: 'quoted_string'
				}
			]
		},

		/**
		 * name: Upgrade
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.42
		 */
		upgrade: {
			$and: [
				{
					literal: 'Upgrade'
				},
				{
					literal: ':'
				},
				{
					token: 'product',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: Via
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		via: {
			$and: [
				{
					literal: 'Via'
				},
				{
					literal: ':'
				},
				{
					$and: [
						{
							token: 'received_protocol'
						},
						{
							token: 'received_by'
						},
						{
							token: 'comment',
							quantifier: '?'
						}
					],
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: received-protocol
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		received_protocol: {
			$and: [
				{
					$and: [
						{
							token: 'protocol_name'
						},
						{
							literal: '/'
						}
					],
					quantifier: '?'
				},
				{
					token: 'protocol_version'
				}
			]
		},

		/**
		 * name: protocol-name
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		protocol_name: {
			token: 'token'
		},

		/**
		 * name: protocol-version
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		protocol_version: {
			token: 'token'
		},

		/**
		 * name: received-by
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		received_by: {
			$or: [
				{
					$and: [
						{
							token: 'host'
						},
						{
							$and: [
								{
									literal: ':'
								},
								{
									token: 'port'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					token: 'pseudonym'
				}
			]
		},

		/**
		 * name: pseudonym
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.45
		 */
		pseudonym: {
			token: 'token'
		},

		/**
		 * name: Warning
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warning: {
			$and: [
				{
					literal: 'Warning'
				},
				{
					literal: ':'
				},
				{
					token: 'warning_value',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: warning-value
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warning_value: {
			$and: [
				{
					token: 'warn_code'
				},
				{
					token: 'SP'
				},
				{
					token: 'warn_agent'
				},
				{
					token: 'SP'
				},
				{
					token: 'warn_text'
				},
				{
					$and: [
						{
							token: 'SP'
						},
						{
							token: 'warn_date'
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: warn-code
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warn_code: {
			token: 'DIGIT',
			quantifier: '3'
		},

		/**
		 * name: warn-agent
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warn_agent: {
			$or: [
				{
					$and: [
						{
							token: 'host'
						},
						{
							$and: [
								{
									literal: ':'
								},
								{
									token: 'port'
								}
							],
							quantifier: '?'
						}
					]
				},
				{
					token: 'pseudonym'
				}
			]
		},

		/**
		 * name: warn-text
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warn_text: {
			token: 'quoted_string'
		},

		/**
		 * name: warn-date
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.46
		 */
		warn_date: {
			$and: [
				{
					literal: '"'
				},
				{
					token: 'http_date'
				},
				{
					literal: '"'
				}
			]
		},

		/**
		 * name: entity-header
		 * ref: https://tools.ietf.org/html/rfc2616#section-7.1
		 */
		entity_header: {
			$or: [
				{
					token: 'allow'
				},
				{
					token: 'content_encoding'
				},
				{
					token: 'content_language'
				},
				{
					token: 'content_length'
				},
				{
					token: 'content_location'
				},
				{
					token: 'content_md5'
				},
				{
					token: 'content_range'
				},
				{
					token: 'content_type'
				},
				{
					token: 'expires'
				},
				{
					token: 'last_modified'
				},
				{
					token: 'extension_header'
				}
			]
		},

		/**
		 * name: Allow
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.7
		 */
		allow: {
			$and: [
				{
					literal: 'Allow'
				},
				{
					literal: ':'
				},
				{
					token: 'method',
					quantifier: '#'
				}
			]
		},

		/**
		 * name: Content-Encoding
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.11
		 */
		content_encoding: {
			$and: [
				{
					literal: 'Content-Encoding'
				},
				{
					literal: ':'
				},
				{
					token: 'content_coding',
					quantifier: '#'
				}
			]
		},

		/**
		 * name: Content-Language
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.11
		 */
		content_language: {
			$and: [
				{
					literal: 'Content-Language'
				},
				{
					literal: ':'
				},
				{
					token: 'language_tag',
					quantifier: '1#'
				}
			]
		},

		/**
		 * name: language-tag
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.10
		 */
		language_tag: {
			$and: [
				{
					token: 'primary_tag'
				},
				{
					$and: [
						{
							literal: '-'
						},
						{
							token: 'subtag'
						}
					],
					quantifier: '*'
				}
			]
		},

		/**
		 * name: primary-tag
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.10
		 */
		primary_tag: {
			token: 'ALPHA',
			quantifier: '1*8'
		},

		/**
		 * name: sub-tag
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.10
		 */
		subtag: {
			token: 'ALPHA',
			quantifier: '1*8'
		},

		/**
		 * name: Content-Length
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.13
		 */
		content_length: {
			$and: [
				{
					literal: 'Content-Length'
				},
				{
					literal: ':'
				},
				{
					token: 'DIGIT',
					quantifier: '1*'
				}
			]
		},

		/**
		 * name: Content-Location
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.14
		 */
		content_location: {
			$and: [
				{
					literal: 'Content-Location'
				},
				{
					literal: ':'
				},
				{
					$or: [
						{
							token: 'absolute_uri'
						},
						{
							token: 'relative_uri'
						}
					]
				}
			]
		},

		/**
		 * name: Content-MD5
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		content_md5: {
			$and: [
				{
					literal: 'Content-MD5'
				},
				{
					literal: ':'
				},
				{
					token: 'md5_digest'
				}
			]
		},

		/**
		 * name: md5-digest
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		md5_digest: {
			token: 'base64',
			quantifier: '24'
		},

		/**
		 * name: Content-Range
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.16
		 */
		content_range: {
			$and: [
				{
					literal: 'Content-Range'
				},
				{
					literal: ':'
				},
				{
					token: 'content_range_spec'
				}
			]
		},

		/**
		 * name: content-range-spec
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		content_range_spec: {
			token: 'byte_content_range_spec'
		},

		/**
		 * name: byte-content-range-spec
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		byte_content_range_spec: {
			$and: [
				{
					token: 'bytes_unit'
				},
				{
					token: 'SP'
				},
				{
					token: 'byte_range_resp_spec'
				},
				{
					literal: '/'
				},
				{
					$or: [
						{
							token: 'instance_length'
						},
						{
							literal: '*'
						}
					]
				}
			]
		},

		/**
		 * name: byte-range-resp-spec
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		byte_range_resp_spec: {
			$or: [
				{
					$and: [
						{
							token: 'first_byte_pos'
						},
						{
							literal: '-'
						},
						{
							token: 'last_byte_pos'
						}
					]
				},
				{
					literal: '*'
				}
			]
		},

		/**
		 * name: instance-length
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.15
		 */
		instance_length: {
			literal: 'DIGIT',
			quantifier: '1*'
		},

		/**
		 * name: Content-Type
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.17
		 */
		content_type: {
			$and: [
				{
					literal: 'Content-Type'
				},
				{
					literal: ':'
				},
				{
					token: 'media_type'
				}
			]
		},

		/**
		 * name: Content-Type
		 * ref: https://tools.ietf.org/html/rfc2616#section-3.7
		 */
		media_type: {
			$and: [
				{
					token: 'type'
				},
				{
					literal: '/'
				},
				{
					token: 'subtype'
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
		 * name: Expires
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.21
		 */
		expires: {
			$and: [
				{
					literal: 'Expires'
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
		 * name: Last-Modified
		 * ref: https://tools.ietf.org/html/rfc2616#section-14.29
		 */
		last_modified: {
			$and: [
				{
					literal: 'Last-Modified'
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
		 * notes: The official definition is more complex but this is a temporary placeholder
		 */
		field_content: {
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
