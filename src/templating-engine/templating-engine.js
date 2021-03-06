var Util = require('../util/util');

module.exports = (function () {
	'use strict';

	function TemplatingEngine () {}

	/**
	 * Initialization logic
	 */

	TemplatingEngine.prototype.init = function (config) {
		config = config || {};

		this.middlewares = {};

		this.starOperatorRange = config.starOperatorRange || [
			0,
			2
		];
		this.plusOperatorRange = config.plusOperatorRange || [
			1,
			4
		];
		this.optionalOperatorRange = config.optionalOperatorRange || [
			0,
			1
		];
	};

	/**
	 * Rendering logic
	 */

	TemplatingEngine.prototype.render = function (template, mainKey) {
		if (!(mainKey in template)) {
			throw new Error(
				'TemplatingEngine: Main key `' + mainKey + '` not in template'
			);
		}

		return this.renderToken(template, template[mainKey]);
	};

	TemplatingEngine.prototype.renderToken = function (template, mainToken) {
		var iterations = this.applyQuantifier(mainToken);

		var literals = [];
		var literal = null;

		for (var i = 0; i < iterations; i++) {
			if ('literal' in mainToken) {
				literal = mainToken.literal;
			}
			else if ('token' in mainToken) {
				literal = this.resolveToken(template, mainToken.token);
			}
			else {
				literal = this.applyOperator(template, mainToken);
			}

			literals.push(literal);
		}

		return literals.join('');
	};

	TemplatingEngine.prototype.applyOperator = function (template, mainToken) {
		if ('$and' in mainToken) {
			return this.applyAndOperator(template, mainToken);
		}

		if ('$or' in mainToken) {
			return this.applyOrOperator(template, mainToken);
		}

		throw new Error(
			'TemplatingEngine: No valid operator in object `' + JSON.stringify(mainToken) + '`'
		);
	};

	TemplatingEngine.prototype.applyAndOperator = function (template, mainToken) {
		var tokens = mainToken.$and;

		return tokens
			.map(function (token) {
				return this.renderToken(template, token);
			}.bind(this))
			.join('');
	};

	TemplatingEngine.prototype.applyOrOperator = function (template, mainToken) {
		var tokens = mainToken.$or;

		var index = Util.getRandomInt(0, tokens.length - 1);

		return this.renderToken(template, tokens[index]);
	};

	TemplatingEngine.prototype.applyQuantifier = function (mainToken) {
		var quantifier = mainToken.quantifier;
		var range = null;

		var nquantifier = null;
		if (!isNaN(nquantifier = Number(quantifier))) {
			range = [
				nquantifier,
				nquantifier
			];
		}
		else {
			switch (quantifier) {
				case '*':
					range = this.starOperatorRange;
					break;
				case '+':
					range = this.plusOperatorRange;
					break;
				case '?':
					range = this.optionalOperatorRange;
					break;
				default:
					range = [
						1,
						1
					];
					break;
			}
		}

		return Util.getRandomInt(range[0], range[1]);
	};

	/**
	 * Middleware logic
	 */

	TemplatingEngine.prototype.addMiddleware = function (token, middleware) {
		if (token in this.middlewares) {
			throw new Error(
				'TemplatingEngine: Middleware already registered for token `' + token + '`'
			);
		}

		this.middlewares[token] = middleware;
	};

	TemplatingEngine.prototype.resolveToken = function (template, token) {
		var resolvedToken = null;

		if (token in this.middlewares) {
			resolvedToken = this.middlewares[token](template, token);
		}
		else {
			resolvedToken = this.render(template, token);
		}

		return resolvedToken;
	};

	return new TemplatingEngine();
})();
