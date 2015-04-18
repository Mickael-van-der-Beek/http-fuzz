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
		 * name: CHAR
		 * ref: https://tools.ietf.org/html/rfc822#section-3.3
		 */
		CHAR: {
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
		}

	};
})();
