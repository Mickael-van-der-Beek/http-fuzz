var RFC822FormatTemplate = require('../format/rfc822-template');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return _.extend(RFC822FormatTemplate, {

		/**
		 * name: credentials
		 * ref: https://tools.ietf.org/html/rfc2617#section-1.2
		 */
		credentials: {
			$and: [
				{
					token: 'auth_scheme'
				},
				{
					token: 'auth_param',
					quantifier: '#'
				}
			]
		},

		/**
		 * name: auth-scheme
		 * ref: https://tools.ietf.org/html/rfc2617#section-1.2
		 */
		auth_scheme: {
			token: 'token'
		},

		/**
		 * name: auth-param
		 * ref: https://tools.ietf.org/html/rfc2617#section-1.2
		 */
		auth_param: {
			$and: [
				{
					token: 'token'
				},
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

	});
})();
