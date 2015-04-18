var RFC822FormatTemplate = require('../format/rfc822-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, {

		/**
		 * name: absolute-URI
		 * ref: http://tools.ietf.org/html/rfc3986#section-4.3
		 */
		absolute_uri: {
			$and: [
				{
					token: 'scheme'
				},
				{
					literal: ':'
				},
				{
					token: 'hier_part'
				},
				{
					$and: [
						{
							literal: '?'
						},
						{
							token: 'query'
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: scheme
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.1
		 */
		scheme: {
			$and: [
				{
					token: 'ALPHA'
				},
				{
					$or: [
						{
							token: 'ALPHA'
						},
						{
							token: 'DIGIT'
						},
						{
							literal: '+'
						},
						{
							literal: '-'
						},
						{
							literal: '.'
						}
					],
					quantifier: '*'
				}
			]
		},

		/**
		 * name: hier-part
		 * ref: http://tools.ietf.org/html/rfc3986#section-3
		 */
		hier_part: {
			$and: [
				{
					literal: '//'
				},
				{
					token: 'authority'
				},
				{
					$or: [
						{
							token: 'path_abempty'
						},
						{
							token: 'path_absolute'
						},
						{
							token: 'path_rootless'
						},
						{
							token: 'path_empty'
						}
					]
				}
			]
		},

		/**
		 * name: authority
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2
		 */
		authority: {
			$and: [
				{
					$and: [
						{
							token: 'userinfo'
						},
						{
							literal: '@'
						}
					],
					quantifier: '?'
				},
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

		/**
		 * name: userinfo
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.1
		 */
		userinfo: {
			$or: [
				{
					token: 'unreserved'
				},
				{
					token: 'pct_encoded'
				},
				{
					token: 'sub_delims'
				},
				{
					literal: ':'
				}
			],
			quantifier: '*'
		},

		/**
		 * name: unreserved
		 * ref: http://tools.ietf.org/html/rfc3986#section-2.3
		 */
		unreserved: {
			$or: [
				{
					token: 'ALPHA'
				},
				{
					token: 'DIGIT'
				},
				{
					literal: '-'
				},
				{
					literal: '.'
				},
				{
					literal: '_'
				},
				{
					literal: '~'
				}
			]
		},

		/**
		 * name: pct-encoded
		 * ref: http://tools.ietf.org/html/rfc3986#appendix-A
		 */
		pct_encoded: {
			$and: [
				{
					literal: '%'
				},
				{
					token: 'HEXDIG'
				},
				{
					token: 'HEXDIG'
				}
			]
		},

		/**
		 * name: sub-delims
		 * ref: http://tools.ietf.org/html/rfc3986#section-2.2
		 */
		sub_delims: {
			$or: [
				{
					literal: '!'
				},
				{
					literal: '$'
				},
				{
					literal: '&'
				},
				{
					literal: '\''
				},
				{
					literal: '('
				},
				{
					literal: ')'
				},
				{
					literal: '*'
				},
				{
					literal: '+'
				},
				{
					literal: ','
				},
				{
					literal: ';'
				},
				{
					literal: '='
				}
			]
		},

		/**
		 * name: host
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		host: {
			$or: [
				{
					token: 'ip_literal'
				},
				{
					token: 'ipv4_address'
				},
				{
					token: 'reg_name'
				}
			]
		},

		/**
		 * name: IP-literal
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		ip_literal: {
			$and: [
				{
					literal: '['
				},
				{
					$or: [
						{
							token: 'ipv6_address'
						},
						{
							token: 'ipvfuture'
						}
					]
				},
				{
					literal: ']'
				}
			]
		},

		/**
		 * name: IPv6address
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		ipv6_address: {
			$or: [
				{
					$and: [
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							],
							quantifier: '6'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							literal: '::'
						},
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							],
							quantifier: '5'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							token: 'h16',
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							],
							quantifier: '4'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-1'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							],
							quantifier: '3'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-2'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							],
							quantifier: '2'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-3'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							$and: [
								{
									token: 'h16'
								},
								{
									literal: ':'
								}
							]
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-4'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							token: 'ls32'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-5'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						},
						{
							token: 'h16'
						}
					]
				},
				{
					$and: [
						{
							$and: [
								{
									$and: [
										{
											token: 'h16'
										},
										{
											literal: ':'
										}
									],
									quantifier: 'XXX-6'
								},
								{
									token: 'h16'
								}
							],
							quantifier: '?'
						},
						{
							literal: '::'
						}
					]
				}
			]
		},

		/**
		 * name: reg-name
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		reg_name: {
			$or: [
				{
					token: 'unreserved'
				},
				{
					token: 'pct_encoded'
				},
				{
					token: 'sub_delims'
				}
			],
			quantifier: '?'
		},

		/**
		 * name: ls32
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		ls32: {
			$or: [
				{
					$and: [
						{
							token: 'h16'
						},
						{
							literal: ':'
						},
						{
							token: 'h16'
						}
					]
				},
				{
					token: 'ipv4_address'
				}
			]
		},

		/**
		 * name: h16
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		h16: {
			token: 'HEXDIG',
			quantifier: '1*4'
		},

		/**
		 * name: IPv4address
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		ipv4_address: {
			$and: [
				{
					token: 'dec_octet'
				},
				{
					literal: '.'
				},
				{
					token: 'dec_octet'
				},
				{
					literal: '.'
				},
				{
					token: 'dec_octet'
				},
				{
					literal: '.'
				},
				{
					token: 'dec_octet'
				}
			]
		},

		/**
		 * name: dec-octet
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		dec_octet: {
			$or: [
				{
					token: 'DIGIT'
				},
				{
					$or: Array.apply(
							null,
							new Array(9)
						)
						.map(function (item, index) {
							return {
								literal: String.fromCharCode(49 + index)
							};
						})
				},
				{
					$and: [
						{
							literal: '1'
						},
						{
							token: 'DIGIT',
							quantifier: 2
						}
					]
				},
				{
					$and: [
						{
							literal: '2'
						},
						{
							$or: Array.apply(
									null,
									new Array(5)
								)
								.map(function (item, index) {
									return {
										literal: String.fromCharCode(48 + index)
									};
								})
						},
						{
							token: 'DIGIT'
						}
					]
				},
				{
					$and: [
						{
							literal: '25'
						},
						{
							$or: Array.apply(
									null,
									new Array(6)
								)
								.map(function (item, index) {
									return {
										literal: String.fromCharCode(48 + index)
									};
								})
						}
					]
				}
			]
		},

		/**
		 * name: IPvFuture
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.2
		 */
		ipvfuture: {
			$and: [
				{
					literal: 'v'
				},
				{
					token: 'HEXDIG',
					quantifier: '+'
				},
				{
					literal: '.'
				},
				{
					$or: [
						{
							token: 'unreserved'
						},
						{
							token: 'sub_delims'
						},
						{
							literal: ':'
						}
					],
					quantifier: '+'
				}
			]
		},

		/**
		 * name: port
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.2.3
		 */
		port: {
			token: 'DIGIT',
			quantifier: '*'
		},

		/**
		 * name: path-abempty
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		path_abempty: {
			$and: [
				{
					literal: '/'
				},
				{
					token: 'segment'
				}
			],
			quantifier: '*'
		},

		/**
		 * name: path-absolute
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		path_absolute: {
			$and: [
				{
					literal: '/'
				},
				{
					$and: [
						{
							token: 'segment_nz'
						},
						{
							$and: [
								{
									literal: '/'
								},
								{
									token: 'segment'
								}
							],
							quantifier: '*'
						}
					],
					quantifier: '?'
				}
			]
		},

		/**
		 * name: path-rootless
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		path_rootless: {
			$and: [
				{
					token: 'segment_nz'
				},
				{
					$and: [
						{
							literal: '/'
						},
						{
							token: 'segment'
						}
					],
					quantifier: '*'
				}
			]
		},

		/**
		 * name: path-empty
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		path_empty: {
			token: 'pchar',
			quantifier: '0'
		},

		/**
		 * name: segment
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		segment: {
			token: 'pchar',
			quantifier: '*'
		},

		/**
		 * name: segment-nz
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		segment_nz: {
			token: 'pchar',
			quantifier: '+'
		},

		/**
		 * name: pchar
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.3
		 */
		pchar: {
			$or: [
				{
					token: 'unreserved'
				},
				{
					token: 'pct_encoded'
				},
				{
					token: 'sub_delims'
				},
				{
					literal: ':'
				},
				{
					literal: '@'
				}
			]
		},

		/**
		 * name: query
		 * ref: http://tools.ietf.org/html/rfc3986#section-3.4
		 */
		query: {
			$or: [
				{
					token: 'pchar'
				},
				{
					literal: '/'
				},
				{
					literal: '?'
				}
			],
			quantifier: '*'
		}

	});
})();
