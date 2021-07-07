const
  dot = require("dot"),
  fs = require("fs");

module.exports = function(req, res) {

	dot.log = false;
	try {
		dot.process({
			global: "_page.render",
			destination: rootDir + "/render",
			path: (rootDir + "/templates/default")
		});
	} catch (e) {
		return res.json({ ok: false });
	}

	res.json({ ok: true });
};