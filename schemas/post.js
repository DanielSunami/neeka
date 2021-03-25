var Schema = require('mongoose').Schema;

var post = new Schema({
	title: String,
	slug: String,
	preview: String,
	body: String,
	author: { type: Schema.Types.ObjectId, ref: 'users' },
	published: Boolean,
	keywords: String,
	description: String,
	tags: { type: [Schema.Types.ObjectId], index: true, ref: 'tags'},
	created_on: { type: Date, default: Date.now, index: -1 },
	last_update: { type: Date, default: Date.now }
});

post.query = {

	/**
	 * 
	 * date = array[3]
	 * date[0] = day
	 * date[1] = month
	 * date[2] = year
	 * 
	 **/
	publishedByDate: function(year, month, day, page, itens) {
		page = parseInt(page) || 0;
		itens = parseInt(itens) || 5;
		--month; //month is zero-based
		return this.find({ published: true, "created_on": {
			"$gte": new Date(new Date(year, month, day).setUTCHours(0,0,0,0)),
			"$lte": new Date(new Date(year, month, day).setUTCHours(23,59,59,999))
		}}).skip(page*itens).limit(itens);
	},

	/**
	 * 
	 * monthYear = array[2]
	 * monthYear[0] = month
	 * monthYear[1] = year
	 *
	 **/
	publishedByYearMonth: function(year, month, page, itens){
		page = page || 0;
		itens = itens || 5;
		--month; //month is zero-based
		return this.find({ published: true, "created_on": {
			"$gte": new Date(new Date(year, month, 1).setUTCHours(0,0,0,0)),
			"$lte": new Date(new Date(year, month, 31).setUTCHours(23,59,59,999))
		}}).skip(page*itens).limit(itens);
	},

	publishedByYear: function(year, page, itens){
		page = page || 0;
		itens = itens || 5;
		return this.find({ published: true, "created_on": {
			"$gte": new Date(new Date(year, 0, 1).setUTCHours(0,0,0,0)), 
			"$lte": new Date(new Date(year, 11, 31).setUTCHours(23,59,59,999))
		}}).skip(page*itens).limit(itens);
	},

	bySlug: function(year, month, day, slug){
		--month; //month is zero-based
		return this.findOne({ published: true, slug: new RegExp(slug, 'i'), "created_on": {
			"$gte": new Date(new Date(year, month, day).setUTCHours(0,0,0,0)),
			"$lte": new Date(new Date(year, month, day).setUTCHours(23,59,59,999))
		}});
	},

	published: function(page, itens){
		page = page || 0;
		itens = itens || 5;
		return this.find({ published: true }).skip(page*itens).limit(itens);
	},

	drafts: function(){
		return this.find({ published: false });
	},

	byTags: function(tagsId){
		return this.find({ published: true, tags: { $in: tagsId } });
	}
}

var meta = new Schema({
	published: Number,
	draft: Number,
	byYear: [{
		year: Number, 
		qty: Number
	}],
	byYearMonth: [{
		yearMonth: String, 
		qty: Number
	}],
	byAuthor: [{
		author: Schema.Types.ObjectId, 
		qty: Number
	}],
	created_on: { type: Date, default: Date.now, index: -1 },
	last_update: { type: Date, default: Date.now }
});

meta.statics = {

	addToPublished: function(done) {
		this.findByIdAndUpdate('5a5ab903486beb7fce003a39', { $inc: { published: 1 } }).exec(done);
	},

	addToDraft: function(done) {
		this.findByIdAndUpdate('5a5ab903486beb7fce003a39', { $inc: { draft: 1 } }).exec(done);
	},
	
	addToYear: function(year, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			var found = false;

			for (var i = 0; i < doc.byYear.length; i++) {
				if(doc.byYear[i].year == year){
					doc.byYear[i].qty++;
					found = true;
				}
			}

			if(!found) doc.byYear.push({'year': year, 'qty':1});
			doc.save(done);
		});
	},
	
	/*
	 * @year - full year format YYYY
	 * @month - zero based, 0 = jan & 11 = dez
	 */
	addToYearMonth: function(year, month, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			let found = false;

			for (let i = 0; i < doc.byYearMonth.length; i++) {
				if(doc.byYearMonth[i].yearMonth == year+'-'+month){
					doc.byYearMonth[i].qty++;
					found = true;
				}
			}

			if(!found) doc.byYearMonth.push({'yearMonth': year+'-'+month, 'qty':1});
			doc.save(done);
		});
	},

	/*
	 * @author - author's id
	 */
	addToAuthor: function(author, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			let found = false;

			for (let i = 0; i < doc.byAuthor.length; i++) {
				if(doc.byAuthor[i].author.toString() == author){
					doc.byAuthor[i].qty++;
					found = true;
				}
			}

			if(!found) doc.byAuthor.push({'author': author, 'qty':1});
			doc.save(done);
		});
	},

	removeFromPublished: function(done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			if(doc.published > 0) doc.published--;
			doc.save(done);
		});
	},

	removeFromDraft: function(done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			if(doc.draft > 0) doc.draft--;
			doc.save(done);
		});
	},

	removeFromYear: function(year, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			let found = false;

			for (let i = 0; i < doc.byYear.length; i++) {
				if(doc.byYear[i].year == year){
					doc.byYear[i].qty--;
					found = true;
				}
			};

			if(found) doc.save(done);
		});
	},
	
	removeFromYearMonth: function(year, month, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			let found = false;

			for (let i = 0; i < doc.byYearMonth.length; i++) {
				if(doc.byYearMonth[i].yearMonth == year+'-'+month){
					doc.byYearMonth[i].qty--;
					found = true;
				}
			};

			if(found) doc.save(done);
		});
	},

	/*
	 * @author - author's id
	 */
	removeFromAuthor: function(author, done) {
		this.findById('5a5ab903486beb7fce003a39', function(err, doc){
			let found = false;

			for (let i = 0; i < doc.byAuthor.length; i++) {
				if(doc.byAuthor[i].author.toString() == author){
					doc.byAuthor[i].qty--;
					found = true;
				}
			};

			if(found) doc.save(done);
		});
	}
}

meta.query = {

	/**
	 * 
	 * @monthYear Array[2]
	 * monthYear[0] = month
	 * monthYear[1] = year
	 *
	 **/
	publishedByYearMonth: function(){
		return this.findOne({_id: '5a5ab903486beb7fce003a39'}, 'byYearMonth');
	},

	publishedByYear: function(){
		return this.findOne({_id: '5a5ab903486beb7fce003a39'}, 'byYear');
	},

	byAuthor: function(){
		return this.findOne({_id: '5a5ab903486beb7fce003a39'}, 'byAuthor');
	},

	published: function(){
		return this.findOne({_id: '5a5ab903486beb7fce003a39'}, 'published');
	},

	drafts: function(){
		return this.findOne({_id: '5a5ab903486beb7fce003a39'}, 'draft');
	}

/* TO DO
	byTags: function(tagsId){
		return this.find({ published: true, tags: { $in: tagsId } });
	}
*/
}

post.meta = meta;

module.exports = post;