module.exports = (function () {
	'use strict';

	return {

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

		h16: {
			token: 'HEXDIG',
			quantifier: '1*4'
		},

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

		dec_octet: {
			$or: [
				{
					token: 'DIGIT'
				},
				{
					token: 'DIGIT'
				},
				{
					token: 'DIGIT'
				},
				{
					token: 'DIGIT'
				}
			]
		},

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
		}

	};
})();
