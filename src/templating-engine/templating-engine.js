var Util = require('../util/util');

module.exports = (function () {
	'use strict';

	function TemplatingEngine () {}

	TemplatingEngine.prototype.init = function (config) {
		config = config || {};

		this.starOperatorRange = config.starOperatorRange || [
			0,
			2
		];
		this.plusOperatorRange = config.plusOperatorRange || [
			1,
			2
		];
		this.optionalOperatorRange = config.optionalOperatorRange || [
			0,
			1
		];
	};

	TemplatingEngine.prototype.render = function (template, mainKey) {
		if (!(mainKey in template)) {
			throw new Error(
				'TemplatingEngine: Main key `' + mainKey + '` not in template'
			);
		}

		var mainToken = template[mainKey];

		var literal = null;

		if ('literal' in mainToken) {
			literal = mainToken.literal;
		}
		else if ('token' in mainToken) {
			literal = this.render(template, mainToken.token);
		}


	};

	TemplatingEngine.prototype.applyOperator = function (mainToken) {
		if ('$or' in mainToken) {
			return this.applyOrOperator(mainToken);
		}

		if ('$and' in mainToken) {
			return this.applyOrOperator(mainToken);
		}

		throw new Error(
			'TemplatingEngine: No valid operator in object `' + JSON.stringify(mainToken) + '`'
		);
	};

	TemplatingEngine.prototype.applyQuantifier = function (mainToken) {
		var quantifier = mainToken.quantifier;
		var range = null;

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

		return Util.getRandomInt(range[0], range[1]);
	};

	TemplatingEngine.prototype.applyOrOperator = function () {};

	TemplatingEngine.prototype.applyAndOperator = function () {};

	return new TemplatingEngine();
});
