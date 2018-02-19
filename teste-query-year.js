var mongoose = require('mongoose'),
	schemas = require('./schemas'),
	util = require('util'),
	fs = require('fs');

try{
	fs.readFile('./dbconf.json','utf8', function(err, raw){
		if(err){
			console.error('Error while reading MongoDB configuration file! (dbconf.json)\nError:'+err+'\nExiting!');
		} else {
			var mongoConf = JSON.parse(raw);
			if(mongoConf.user)
				mongoUri = util.format('mongodb://%s:%d/%s',
					mongoConf.hostname,
					mongoConf.port,
					mongoConf.dbname);
			else
				mongoUri = util.format('mongodb://%s:%s@%s:%d/%s',
					mongoConf.user,
					mongoConf.password,
					mongoConf.hostname,
					mongoConf.port,
					mongoConf.dbname);

			mongoose.connect(mongoUri, {server:{auto_reconnect:true}});
		}
	});
}catch(err){
	console.error('MongoDB configuration file missing! (dbconf.json)\nExiting!');
}


model = {
	'user': mongoose.model('users', schemas.user),
	'post': mongoose.model('posts', schemas.post),
	'tag': mongoose.model('tags', schemas.tag),
	'meta_posts': mongoose.model('meta_posts', schemas.post.meta)
};

/*
model.post
	.find()
	.publishedByYear('2013')
	.sort({'created_on':-1})
	.populate('author')
	.exec(function(err,docs){
		
		console.log(docs.length);

	});

model.user.where('_id', '59ada90bec745414b0514240').exec(function(err, docs){
	console.log(docs);
})

model.meta_posts.findById('5a5ab903486beb7fce003a39').save(function(err, doc){
	if(!err) console.log("saved!");
});

model.meta_posts.removeFromYearMonth(2015,3);
*/

