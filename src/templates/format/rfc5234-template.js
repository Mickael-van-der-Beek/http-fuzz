module.exports = (function () {
	'use strict';

	return {

		/**
		 * name: VCHAR
		 * ref: https://tools.ietf.org/html/rfc5234#appendix-B.1
		 */
		VCHAR: {
			$or: Array.apply(
					null,
					new Array(93)
				)
				.map(function (item, index) {
					return {
						literal: String.fromCharCode(33 + index)
					};
				})
		}

	};
})();
