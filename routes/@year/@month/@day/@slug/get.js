let render = require(rootDir+'/render');
const sqlite = require(rootDir+'/lib/sqlite');
const { shapePost } = require(rootDir+'/lib/pageData');

module.exports = function(req, res, next){
	if(isNaN(req.params.year)) return next();

	const db = sqlite.open();
	const year = String(req.params.year);
	const month = zeroLeftMask(req.params.month);
	const day = zeroLeftMask(req.params.day);
	const ymd = year + '-' + month + '-' + day;

	req.pageData.url = "/" + year + "/" + month + "/" + day + "/" + req.params.slug;

	const row = db.prepare(`
		SELECT p.id, p.title, p.slug, p.preview, p.body, p.author_id, p.published,
			p.description, p.og_image, p.created_on, p.last_update,
			u.firstname AS author_firstname, u.lastname AS author_lastname, u.website AS author_website
		FROM posts p
		JOIN users u ON u.id = p.author_id
		WHERE p.published = 1
			AND p.slug = ? COLLATE NOCASE
			AND strftime('%Y-%m-%d', p.created_on) = ?
	`).get(req.params.slug, ymd);

	if(!row){
		res.status(404).end("not found!");
	} else {
		const post = shapePost(row);
		const host = (req.pageData.site.url || '').replace(/\/$/, '');
		const origin = /^https?:\/\//i.test(host) ? host : ('https://' + host);
		const canonical = origin + req.pageData.url;
		const jsonLd = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.description || '',
			datePublished: post.created_on ? post.created_on.toISOString() : undefined,
			dateModified: post.last_update ? post.last_update.toISOString() : undefined,
			author: {
				'@type': 'Person',
				name: post.author.fullName
			},
			mainEntityOfPage: canonical,
			publisher: {
				'@type': 'Organization',
				name: req.pageData.site.name
			}
		};
		if (post.author.website) jsonLd.author.url = post.author.website;
		if (post.og_image) jsonLd.image = post.og_image;

		req.pageData.post = post;
		req.pageData.title = post.title;
		req.pageData.canonical = canonical;
		req.pageData.jsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
		if(post.description) req.pageData.site.description = post.description;
		res.send(render.blog_post(req.pageData));
	}
};
