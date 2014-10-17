var express = require('express');
var router = express.Router();
var config = require('../config.js');
var util = require('util');
var path = require('path');
/* GET home page. */
debugger;
router.get('/', function(req, res) {
	// check if there is an existing access token in session
	if(req.session.oauth2AccessToken){
		console.log('Existing access token is found, skip anthentication n authorization phase');
		res.render('oauth-success.html', {
			accessToken: req.session.oauth2AccessToken,
			refreshToken: req.session.oauth2RefreshToken,
			apiRootPath: config.path,
			oauth2Response: req.session.oauth2Response
		});
	}else{
		// Get a new access token
		console.log('There is no access token found in session, redirect to Tradeshift oauth URL');
		var url = util.format('%s/auth/login?response_type=code'+
		  '&client_id=%s' +
		  '&redirect_uri=%s'+
		  '&scope=openid offline',
		  config.tradeshiftEndpoint, config.authId, config.thirdPartyEndpoint);
		console.log('redirect to '+ url);
		res.redirect(url);
	}
});

router.post('/re-auth', function(req, res) {
	// clear old access toke from session
	delete req.session.oauth2AccessToken;
	res.send('ok');
});

module.exports = router;