var Promise = require('bluebird');
var db      = require('../db');

module.exports = function( app ) {
	app.get('/', function( req, res, next ) {
		var data = {
			articles         : db.Article.scope('asTile').findAll({orderBy: 'createdAt DESC'}),
			highlightedIdeas : db.Idea.getHighlighted(),
			upcomingMeetings : db.Meeting.getUpcoming(3)
		};
		
		Promise.props(data)
		.then(function( data ) {
			res.out('index', true, data);
		})
		.catch(next);
	});
};