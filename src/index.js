var TemplatingEngine = require('./templating-engine/templating-engine');
var RequestTemplate = require('./templates/request-template');

module.exports = (function () {
	'use strict';

	var request = TemplatingEngine.render(RequestTemplate, 'request');

	console.log(request);
});
