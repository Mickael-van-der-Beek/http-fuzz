module.exports = (function () {
	'use strict';

	return {

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

		CR: {
			literal: '\r'
		},

		LF: {
			literal: '\n'
		},

		SP: {
			literal: ' '
		},

		CTL: {
			$or: (
				new Array(31)
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

		HT: {
			literal: '\t'
		},

		DIGIT: {
			$or: (
				new Array(10)
			)
			.map(function (item, index) {
				return {
					literal: String.fromCharCode(48 + index)
				};
			})
		}

	};
})();
