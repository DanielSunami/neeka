function parseDate(value) {
	if (!value) return null;
	if (value instanceof Date) return value;
	return new Date(value);
}

function pageData(req, res, next) {
	const conf = global.NEEKA || {};
	req.pageData = {
		title: '',
		subtitle: '',
		site: {
			name: conf.name || '',
			url: conf.url || '',
			description: conf.description || '',
			keywords: conf.keywords || '',
			gaUID: conf.gaUID || '',
			template: conf.template || 'default'
		}
	};
	next();
}

function shapePost(row) {
	if (!row) return null;
	const firstname = row.author_firstname != null ? row.author_firstname : (row.firstname || '');
	const lastname = row.author_lastname != null ? row.author_lastname : (row.lastname || '');
	return {
		_id: row.id,
		id: row.id,
		title: row.title,
		slug: row.slug,
		preview: row.preview,
		body: row.body,
		published: !!row.published,
		keywords: row.keywords,
		description: row.description,
		created_on: parseDate(row.created_on),
		last_update: parseDate(row.last_update),
		author: {
			_id: row.author_id,
			firstname: firstname,
			lastname: lastname,
			website: row.author_website != null ? row.author_website : (row.website || ''),
			fullName: (firstname + ' ' + lastname).trim(),
			preferences: { editor: row.author_editor || 'trix' }
		}
	};
}

function shapeUser(row) {
	if (!row) return null;
	let permissions = [];
	try { permissions = JSON.parse(row.permissions || '[]'); } catch (e) {}
	return {
		_id: row.id,
		id: row.id,
		firstname: row.firstname,
		lastname: row.lastname || '',
		website: row.website || '',
		email: row.email,
		birthday: parseDate(row.birthday),
		permissions: permissions,
		preferences: { editor: row.editor || 'trix' },
		created_on: parseDate(row.created_on),
		last_update: parseDate(row.last_update),
		fullName: ((row.firstname || '') + ' ' + (row.lastname || '')).trim()
	};
}

module.exports = { pageData, shapePost, shapeUser, parseDate };
