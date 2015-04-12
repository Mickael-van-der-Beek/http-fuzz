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
			$or: [
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
				14,
				15,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
				23,
				24,
				25,
				26,
				27,
				28,
				29,
				30,
				31
			]
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
			$or: [
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9
			]
			.map(function (item, index) {
				return {
					literal: String.fromCharCode(48 + index)
				};
			})
		},

		CHAR: {
			$or: []
			.concat(
				[
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					20,
					21,
					22,
					23,
					24,
					25
				]
				.map(function (item, index) {
					return {
						literal: String.fromCharCode(65 + index)
					};
				}),
				[
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					20,
					21,
					22,
					23,
					24,
					25
				]
				.map(function (item, index) {
					return {
						literal: String.fromCharCode(97 + index)
					};
				})
			)
		}

	};
})();
