module.exports = (function () {
	'use strict';

	return {

		/**
		 * name: CRLF
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		CRLF: {
			$and: [
				{
					token: 'CR'
				},
				{
					token: 'LF'
				}
			]
		},

		/**
		 * name: CR
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		CR: {
			literal: '\r'
		},

		/**
		 * name: LF
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		LF: {
			literal: '\n'
		},

		/**
		 * name: CTL
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		CTL: {
			$or: Array.apply(
				null,
				new Array(32)
			)
			.map(function (item, index) {
				return {
					literal: String.fromCharCode(index)
				};
			})
			.concat([
				{
					literal: String.fromCharCode(127)
				}
			])
		},

		/**
		 * name: HTAB
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		HT: {
			literal: '\t'
		},

		/**
		 * name: DIGIT
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		DIGIT: {
			$or: Array.apply(
					null,
					new Array(10)
				)
				.map(function (item, index) {
					return {
						literal: String.fromCharCode(48 + index)
					};
				})
		},

		/**
		 * name: ALPHA
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		ALPHA: {
			$or: []
				.concat(
					Array.apply(
						null,
						new Array(26)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(65 + index)
						};
					}),
					Array.apply(
						null,
						new Array(26)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(97 + index)
						};
					})
				)
		},

		/**
		 * name: hex
		 * ref: https://tools.ietf.org/html/rfc3986#appendix-D.2
		 */
		hex: {
			$or: []
				.concat(
					Array.apply(
						null,
						new Array(10)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(48 + index)
						};
					}),
					Array.apply(
						null,
						new Array(6)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(65 + index)
						};
					}),
					Array.apply(
						null,
						new Array(6)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(97 + index)
						};
					})
				)
		},

		/**
		 * notes: This definition is custom since it's not present in the RFC's
		 */
		base64: {
			$or: []
				.concat(
					Array.apply(
						null,
						new Array(10)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(48 + index)
						};
					}),
					Array.apply(
						null,
						new Array(26)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(65 + index)
						};
					}),
					Array.apply(
						null,
						new Array(26)
					)
					.map(function (item, index) {
						return {
							literal: String.fromCharCode(97 + index)
						};
					}),
					[
						'+',
						'/',
						'='
					]
				)
		},

		/**
		 * name: CHAR
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		CHAR: {
			$or: Array.apply(
					null,
					new Array(128)
				)
				.map(function (item, index) {
					return {
						literal: String.fromCharCode(index)
					};
				})
		},

		/**
		 * name: quoted-string
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 * notes: RFC2616 uses the "qdtext" token rather than "qtext"
		 */
		quoted_string: {
			$and: [
				{
					literal: '"'
				},
				{
					$or: [
						{
							token: 'qtext'
						},
						{
							token: 'quoted_pair'
						}
					]
				},
				{
					literal: '"'
				}
			]
		},

		/**
		 * name: qtext
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		qtext: {
			$or: []
				.concat(
					Array.apply(
						null,
						new Array(128)
					)
					.reduce(function (qtext, item, index) {
						var chr = String.fromCharCode(index);

						if (chr !== '"' && chr !== '\\' && chr !== '\r') {
							qtext.push({
								literal: chr
							});
						}

						return qtext;
					}, []),
					{
						token: 'linear_white_space'
					}
				)
		},

		/**
		 * name: linear-white-space
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		linear_white_space: {
			$and: [
				{
					token: 'CRLF',
					quantifier: '?'
				},
				{
					token: 'LWSP_char'
				}
			],
			quantifier: '1*'
		},

		/**
		 * name: LWSP-char
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		LWSP_char: {
			$or: [
				{
					token: 'SP'
				},
				{
					token: 'HT'
				}
			]
		},

		/**
		 * name: quoted-pair
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		quoted_pair: {
			$and: [
				{
					literal: '/'
				},
				{
					token: 'CHAR'
				}
			]
		},

		/**
		 * name: mailbox
		 * ref: https://tools.ietf.org/html/rfc822#section-6.1
		 */
		mailbox: {
			// TODO: Define the mailbox token and try to merge it with the rfc3986 URI definition
			literal: null
		}

	};
})();
