module.exports = [
function(req, res, next) {
	req.data = {
		update: {
			published: 0,
			draft: 0,
			byYear: [],
			byYearMonth: [],
			byAuthor: []
		}
	};

	next();
},

// count published
function(req, res, next) {

	model.post.count({ published: true }).exec(function(err, count) {

		req.data.update.published = count;
		next();
	});
},

// count draft
function(req, res, next) {

	model.post.count({ published: false }).exec(function(err, count) {

		req.data.update.draft = count;
		next();
	});
},

// count group by Author
function(req, res, next) {

	let pipeline = [{
		$group: {
			_id: '$author',
			qty: { $sum: 1 }
		}
	},
	{
		$project: {
			_id: 0,
			author: "$_id",
			qty: 1
		}
	}];

	model.post.aggregate(pipeline).exec(function(err, count) {
		
		req.data.update.byAuthor = count;
		next();
	});
},

// count group by Year
function(req, res, next) {

	let pipeline = [{
		$group: {
			_id: { $dateToString: { format: "%Y", date: "$created_on" }},
			qty: { $sum: 1 }
		}
	},
	{
		$project: {
			_id: 0,
			year: "$_id",
			qty: 1
		}
	}];

	model.post.aggregate(pipeline).exec(function(err, count) {

		req.data.update.byYear = count;
		next();
	});
},

// count group by YearMonth
function(req, res, next) {

	let pipeline = [{
		$group: {
			_id: { $dateToString: { format: "%Y-%m", date: "$created_on" }},
			qty: { $sum: 1 }
		}
	},
	{
		$project: {
			_id: 0,
			yearMonth: "$_id",
			qty: 1
		}
	}];

	model.post.aggregate(pipeline).exec(function(err, count) {

		req.data.update.byYearMonth = count;
		next();
	});
},

function(req, res, next) {
	req.data.update.last_update = new Date();

	model.meta_posts.findByIdAndUpdate('5a5ab903486beb7fce003a39', req.data.update).exec(function(err, oldDoc) {
		if(err) {
			console.error('[MongoDBError] POST /admin/settings/updateMeta', err);
			res.json({ ok: false });
		} else res.json({ ok: true });
	});
}
];