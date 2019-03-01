const express = require('express');

// todo: du urls moeten anders

let router = express.Router({mergeParams: true});

// the page
router.use( '(?:/budgeting|/begroten)', require('./monolith-routes') );

// base openstad widget
router.use( '(?:/budgeting|/begroten)/site/:siteId(\\d+)', require('./openstad-widget') );

// ideas api
router.use( '/api/site/:siteId(\\d+)/idea', require('./idea-api') );

// ideas widget
router.use( '(?:/budgeting|/begroten)/site/:siteId(\\d+)', require('./ideas-widget') );

// budgeting api
router.use( '/api/site/:siteId(\\d+)/budgeting', require('./budgeting-api') );

// budgeting widget
router.use( '(?:/budgeting|/begroten)/site/:siteId(\\d+)', require('./budgeting-widget') );

module.exports = router;