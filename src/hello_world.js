var sprintf = require("sprintf-js").sprintf;


exports.welcome = function(name) {
	return sprintf('Hello %(name)s', {name: name})
}