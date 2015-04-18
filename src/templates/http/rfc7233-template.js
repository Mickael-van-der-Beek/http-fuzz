var RFC822FormatTemplate = require('../format/rfc822-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, {

		/**
		 * name: range_specifier
		 * ref: https://tools.ietf.org/html/rfc7233#section-3.1
		 */
		range_specifier: {
			$or: [
				{
					token: 'byte_ranges_specifier'
				},
				{
					token: 'other_ranges_specifier'
				}
			]
		},

		/**
		 * name: byte-ranges-specifier
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		byte_ranges_specifier: {
			$and: [
				{
					token: 'bytes_unit'
				},
				{
					literal: '='
				},
				{
					token: 'byte_range_set'
				}
			]
		},

		/**
		 * name: bytes-unit
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		bytes_unit: {
			literal: 'bytes'
		},

		/**
		 * name: byte-range-set
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		byte_range_set: {
			$or: [
				{
					token: 'byte_range_spec'
				},
				{
					token: 'suffix_byte_range_spec'
				}
			],
			quantifier: '1#'
		},

		/**
		 * name: byte-range-spec
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		byte_range_spec: {
			$and: [
				{
					token: 'first_byte_pos'
				},
				{
					literal: '-'
				},
				{
					token: 'last_byte_pos',
					quantifier: '?'
				}
			]
		},

		/**
		 * name: first-byte-pos
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		first_byte_pos: {
			token: 'DIGIT',
			quantifier: '1*'
		},

		/**
		 * name: last-byte-pos
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		last_byte_pos: {
			token: 'DIGIT',
			quantifier: '1*'
		},

		/**
		 * name: suffix-byte-range-spec
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		suffix_byte_range_spec: {
			$and: [
				{
					literal: '-'
				},
				{
					token: 'suffix_length'
				}
			]
		},

		/**
		 * name: suffix-length
		 * ref: https://tools.ietf.org/html/rfc7233#section-2.1
		 */
		suffix_length: {
			token: 'DIGIT',
			quantifier: '1*'
		},

		/**
		 * name: other_ranges_specifier
		 * ref: https://tools.ietf.org/html/rfc7233#section-3.1
		 */
		other_ranges_specifier: {
			$and: [
				{
					token: 'other_range_unit'
				},
				{
					literal: '='
				},
				{
					token: 'other_range_set'
				}
			]
		},

		/**
		 * name: other-range-set
		 * ref: https://tools.ietf.org/html/rfc7233#section-3.1
		 */
		other_range_set: {
			token: 'VCHAR',
			quantifier: '1*'
		},

		

	});
})();
