const sqlite = require(rootDir+'/lib/sqlite');

function origin() {
	const host = ((global.NEEKA && NEEKA.url) || '').replace(/\/$/, '');
	if (!host) return '';
	return /^https?:\/\//i.test(host) ? host : ('https://' + host);
}

function escapeXml(s) {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function locFromCreated(created, slug) {
	const ymd = String(created || '').slice(0, 10).replace(/-/g, '/');
	return '/' + ymd + '/' + slug;
}

module.exports = function(req, res) {
	const base = origin();
	const db = sqlite.open();
	const rows = db.prepare(`
		SELECT slug, created_on, last_update
		FROM posts
		WHERE published = 1
		ORDER BY created_on DESC
	`).all();

	let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
	xml += '  <url>\n    <loc>' + escapeXml(base + '/') + '</loc>\n  </url>\n';
	rows.forEach(function(row) {
		xml += '  <url>\n';
		xml += '    <loc>' + escapeXml(base + locFromCreated(row.created_on, row.slug)) + '</loc>\n';
		if (row.last_update) {
			xml += '    <lastmod>' + escapeXml(String(row.last_update).slice(0, 10)) + '</lastmod>\n';
		}
		xml += '  </url>\n';
	});
	xml += '</urlset>\n';

	res.set('Content-Type', 'application/xml; charset=utf-8');
	res.send(xml);
};
