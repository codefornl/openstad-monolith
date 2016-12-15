var _      = require('lodash')
  , co     = require('co')
  , moment = require('moment')
var log    = require('debug')('app:db');

module.exports = co.wrap(function*( db ) {
	log('generating meetings...');
	yield meetings.map(function( meetingData ) {
		return db.Meeting.create(meetingData);
	});
	log('generating users and ideas...');
	yield users.map(function( userData ) {
		return db.User.create(userData, {
			include  : [{
				model: db.Idea,
				include: [{
					model : db.Argument,
					as    : 'argumentsAgainst'
				}, {
					model : db.Argument,
					as    : 'argumentsFor'
				}, {
					model: db.Vote
				}]
			}],
			validate : userData.id != 4 // User 4 is anonymous and has credentials
		});
	});
	log('test database complete');
});

var today = moment().startOf('day');

// Meetings
// --------
var meetings = [
	{id: 1, date: moment(today).day(5).toDate()},
	{id: 2, date: moment(today).day(5).add(2, 'weeks').toDate()},
	{id: 3, date: moment(today).day(5).add(4, 'weeks').toDate()}
];
// Users including their ideas
// ---------------------------
var users = [
	{id : 1 , complete : 0 , role : 'unknown'},
	{id : 2 , complete : 1 , role : 'admin'     , userName : 'admin'  , password : 'password'        , firstName : 'Bastard Operator' , lastName : 'from Hell' , gender : 'male' , email: 'tjoekbezoer@gmail.com' , ideas : [
		{
			id               : 1,
			startDate        : moment(today).subtract(1, 'days'),
			title            : 'Metro naar stadsdeel West',
			summary          : 'Een nieuwe metrobuis naar het Bos en Lommerplein',
			description      : 'Ik moet nu een half uur fietsen, dat vind ik veel te lang. Ik wil een extra metrobuis!',
			argumentsAgainst : [
				{userId: 25, sentiment: 'against' , description: 'De kosten van dit idee zullen veel te hoog zijn. Daarnaast zal dit project ook weer enorm uit de hand lopen waarschijnlijk.'}
			],
			argumentsFor     : [
				{userId: 7  , sentiment: 'for'    , description: 'De metro is cool.'},
				{userId: 3  , sentiment: 'for'    , description: 'Fietsen is verschrikkelijk als het regent.'}
			],
			votes: [
				{userId: 3  , opinion: 'yes'},
				{userId: 2  , opinion: 'no'},
				{userId: 4  , opinion: 'yes'},
				{userId: 10 , opinion: 'yes'},
				{userId: 11 , opinion: 'abstain'},
				{userId: 12 , opinion: 'no'},
				{userId: 21 , opinion: 'yes'},
				{userId: 6  , opinion: 'yes'},
				{userId: 8  , opinion: 'no'}
			]
		}, {
			id               : 2,
			startDate        : moment(today).subtract(10, 'days'),
			title            : 'Boomloze wijk',
			summary          : 'Bomen geven troep en nemen licht weg. Uit de grond ermee!',
			description      : 'Al die boomknuffelaars die vast willen houden aan het verleden. Tijd voor een frisse wind! Alle bomen de grond uit, en een hoge muur om alle parken heen, zodat vallende bladeren geen probleem meer zijn!',
			argumentsAgainst : [
				{userId: 19, sentiment: 'against' , description: 'Bomen zijn goed voor mensen, en zuiveren de lucht.'},
				{userId: 30, sentiment: 'against' , description: 'Dit is een hellend vlak. Wat gaat dit betekenen voor de struiken?'}
			],
			votes            : [
				{userId: 2  , opinion: 'yes'},
				{userId: 4  , opinion: 'no'},
				{userId: 5  , opinion: 'no'},
				{userId: 7  , opinion: 'no'},
				{userId: 8  , opinion: 'abstain'},
				{userId: 9  , opinion: 'yes'},
				{userId: 11 , opinion: 'yes'},
				{userId: 13 , opinion: 'no'},
				{userId: 18 , opinion: 'no'},
				{userId: 25 , opinion: 'yes'},
				{userId: 26 , opinion: 'abstain'},
				{userId: 28 , opinion: 'no'},
				{userId: 29 , opinion: 'yes'},
				{userId: 30 , opinion: 'no'}
			]
		}
	]},
	{id : 3  , complete : 1 , role : 'member'   , userName : 'member'   , password : 'member'       , firstName : 'Jennifer'  , lastName : 'Alexander' , gender : 'female' , email : 'tjoekbezoer+member@gmail.com', zipCode : null, ideas :[
		{
			id          : 3,
			startDate   : moment(today).subtract(6, 'days'),
			title       : 'Markt uitbreiden',
			summary     : 'Er moet plek zijn voor twee groentemannen!',
			description : 'De groenteman die er nu staat is veel te duur. Ik wil goedkopere appels, dus er moet concurrentie komen.',
			votes: [
				{userId: 15 , opinion: 'no'},
				{userId: 7  , opinion: 'no'},
				{userId: 19 , opinion: 'yes'},
				{userId: 21 , opinion: 'yes'},
				{userId: 5  , opinion: 'abstain'},
				{userId: 8  , opinion: 'abstain'},
				{userId: 2  , opinion: 'no'}
			]
		}
	]},
	// User 4 validation is skipped, see above.
	{id : 4  , complete : 0 , role : 'anonymous' , userName : 'anon'     , password : 'anon'         , firstName : null        , lastName : null        , gender : 'male'   , email : null                         , zipCode : '1051 RL'} ,
	{id : 5  , complete : 1 , role : 'member'    , userName : 'jedwards' , password : 'QoPNQ8AddeD'  , firstName : 'Jane'      , lastName : 'Edwards'   , gender : 'female' , email : 'jedwards2@statcounter.com'  , zipCode : null}      ,
	{id : 6  , complete : 1 , role : 'member'    , userName : 'david'    , password : 'vPb2ycQFKt8'  , firstName : 'Justin'    , lastName : 'Cole'      , gender : 'male'   , email : 'jcole3@skype.com'           , zipCode : null}      ,
	{id : 7  , complete : 1 , role : 'member'    , userName : 'thomas'   , password : 'ZrY7tsEhlv'   , firstName : 'Sean'      , lastName : 'Scott'     , gender : 'male'   , email : 'crice1@nsw.gov.au'          , zipCode : null}      ,
	{id : 8  , complete : 1 , role : 'member'    , userName : 'beverly'  , password : 'ra4UILqrctwq' , firstName : 'Laura'     , lastName : 'Kim'       , gender : 'female' , email : 'pperkins8@springer.com'     , zipCode : null}      ,
	{id : 9  , complete : 1 , role : 'member'    , userName : 'brandon'  , password : 'fJvrKcEKn'    , firstName : 'Donald'    , lastName : 'Rose'      , gender : 'male'   , email : 'drose6@netscape.com'        , zipCode : '1050 GH'} ,
	{id : 10 , complete : 1 , role : 'member'    , userName : 'gregory'  , password : 'ItNPABxwyj6'  , firstName : 'Joe'       , lastName : 'Greene'    , gender : 'male'   , email : 'jgreene7@uol.com.br'        , zipCode : null}      ,
	{id : 11 , complete : 0 , role : 'anonymous' , userName : null       , password : null           , firstName : null        , lastName : null        , gender : 'female' , email : null                         , zipCode : '1053 BM'} ,
	{id : 12 , complete : 1 , role : 'member'    , userName : 'william'  , password : 'tHZn7Q'       , firstName : 'Albert'    , lastName : 'Miller'    , gender : 'male'   , email : 'amilleru@jugem.jp'          , zipCode : null}      ,
	{id : 13 , complete : 1 , role : 'member'    , userName : 'michelle' , password : '7HMeZ7DGGksV' , firstName : 'Christine' , lastName : 'Fowler'    , gender : 'female' , email : 'cfowlerv@deliciousdays.com' , zipCode : null}      ,
	{id : 14 , complete : 1 , role : 'member'    , userName : 'fitz'     , password : 'a69GBf7GsE4'  , firstName : 'Jimmy'     , lastName : 'Hughes'    , gender : 'male'   , email : 'jhughesw@netlog.com'        , zipCode : '1050 JK'} ,
	{id : 15 , complete : 1 , role : 'member'    , userName : 'albert'   , password : 'I8ireC3iOP'   , firstName : 'Carlos'    , lastName : 'Carr'      , gender : 'male'   , email : 'ccarrx@moonfruit.com'       , zipCode : '1054 WK'} ,
	{id : 16 , complete : 1 , role : 'member'    , userName : 'maria'    , password : 'kb1KeoZc8'    , firstName : 'Jessica'   , lastName : 'Foster'    , gender : 'female' , email : 'jfostery@harvard.edu'       , zipCode : '1050 ER'} ,
	{id : 17 , complete : 1 , role : 'member'    , userName : 'eric'     , password : 'vWSqV8nB'     , firstName : 'Steven'    , lastName : 'Hawkins'   , gender : 'male'   , email : 'shawkinsz@google.com.au'    , zipCode : '1051 AB'} ,
	{id : 18 , complete : 1 , role : 'member'    , userName : 'bonzi'    , password : '63uCZrurs'    , firstName : 'Michelle'  , lastName : 'Jacobs'    , gender : 'female' , email : 'mjacobs10@chronoengine.com' , zipCode : null}      ,
	{id : 19 , complete : 1 , role : 'member'    , userName : 'brenda'   , password : 'rEY06Uly4X'   , firstName : 'Maria'     , lastName : 'Parker'    , gender : 'female' , email : 'leader@nasa.gov.us'         , zipCode : null}      ,
	{id : 20 , complete : 1 , role : 'member'    , userName : 'susan'    , password : 'ybfDLt36NMM'  , firstName : 'Beverly'   , lastName : 'Black'     , gender : 'female' , email : 'madeup@somewhere.com'       , zipCode : null}      ,
	{id : 21 , complete : 0 , role : 'anonymous' , userName : null       , password : null           , firstName : null        , lastName : null        , gender : 'female' , email : null                         , zipCode : '1050 FG'} ,
	{id : 22 , complete : 1 , role : 'member'    , userName : 'kathy'    , password : 'PJxXmeA5XAd'  , firstName : 'Janet'     , lastName : 'Jones'     , gender : 'female' , email : 'jjones14@hp.com'            , zipCode : null}      ,
	{id : 23 , complete : 0 , role : 'anonymous' , userName : null       , password : null           , firstName : null        , lastName : null        , gender : 'female' , email : null                         , zipCode : '1051 TH'} ,
	{id : 24 , complete : 1 , role : 'member'    , userName : 'tina'     , password : 'X6aD06u'      , firstName : 'Janet'     , lastName : 'Smith'     , gender : 'female' , email : 'jsmith16@cnbc.com'          , zipCode : null}      ,
	{id : 25 , complete : 1 , role : 'member'    , userName : 'jessica'  , password : 'WSeqnH'       , firstName : 'Frances'   , lastName : 'Watson'    , gender : 'female' , email : 'fwatson17@alibaba.com'      , zipCode : null}      ,
	{id : 26 , complete : 1 , role : 'member'    , userName : 'jimmy'    , password : 'mRHoBGu1yrKm' , firstName : 'Clarence'  , lastName : 'Jordan'    , gender : 'male'   , email : 'cjordan18@lulu.com'         , zipCode : null}      ,
	{id : 27 , complete : 1 , role : 'member'    , userName : 'anna'     , password : 'E1amNfG'      , firstName : 'Debra'     , lastName : 'Ferguson'  , gender : 'female' , email : 'resistance@underground.fr'  , zipCode : null}      ,
	{id : 28 , complete : 1 , role : 'member'    , userName : 'jennifer' , password : 'ruj44zW9Hgn'  , firstName : 'Lois'      , lastName : 'Hughes'    , gender : 'female' , email : 'lhughes1a@marriott.com'     , zipCode : null}      ,
	{id : 29 , complete : 1 , role : 'member'    , userName : 'lola'     , password : '3esoK36QCnf8' , firstName : 'Jennifer'  , lastName : 'West'      , gender : 'female' , email : 'jwest1b@hugedomains.com'    , zipCode : null}      ,
	{id : 30 , complete : 1 , role : 'member'    , userName : 'theresa'  , password : '9erzgsH'      , firstName : 'Judy'      , lastName : 'Hill'      , gender : 'female' , email : 'jhill1c@4shared.com'        , zipCode : null}      ,
	{id : 31 , complete : 1 , role : 'member'    , userName : 'ryan'     , password : '8Vh1vixS'     , firstName : 'Earl'      , lastName : 'Stone'     , gender : 'male'   , email : 'estone1d@baidu.com'         , zipCode : null}
];