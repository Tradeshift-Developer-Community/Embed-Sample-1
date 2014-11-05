var express = require('express');

var path = require('path');
var util = require('util');
var router = express.Router();
var config = require('../config.js');
var http = config.protocol == 'http:'? require('http') : require('https');
var manifest = require('../manifest/manifest.json');

router.get('/', function(req, res) {
	console.log('/service?code='+ req.query.code);
	if(req.query.code) {
		resolveTokens(req.query.code, function(tokens) {
			console.log('tokens: %j', tokens);
			req.session.oauth2AccessToken = tokens.access_token;
			req.session.oauth2RefreshToken = tokens.refresh_token;
			req.session.oauth2Response = JSON.stringify(tokens, null, '  ');
			res.redirect('/');
		});
	} else {
			res.send(400,'Bad Request');	
	}

});


router.get('/refresh-token', function(req, res) {
	console.log('refresh token: %s', req.session.oauth2RefreshToken);
	refreshTokens(req.session.oauth2RefreshToken, function(tokens, data, error){
		if(error){
			res.send(error);
			return;
		}
		req.session.oauth2AccessToken = tokens.access_token;
		res.send(data);
	});
});

router.get('/revoke-token', function(req, res) {
	revokeToken(req.session.oauth2AccessToken, function(data, error){
		if(error){
			res.send(error);
			return;
		}
		res.send(data);
	});
});

router.get('/account-api', function(req, res) {
		makeDemoAPICall('/rest/external/account/info', req.session.oauth2AccessToken, function(data) {
			res.send(data);
		});
});

router.get('/connection-api', function(req, res) {
	makeDemoAPICall('/rest/external/network', req.session.oauth2AccessToken, function(data) {
		res.send(data);
	});
});

router.get('/invoice-api', function(req, res) {
	makeDemoAPICall('/rest/external/documents/?type=invoice', req.session.oauth2AccessToken, function(data) {
		res.send(data);
	});
});

function resolveTokens(code, callback) {
	var reqOptions = {
		hostname : config.hostname,
		port: config.port,
		path: config.path + '/auth/token',
		method: 'POST',
		auth: config.authId +':'+ config.authSecret,
		headers: {
			"Accept" : "application/json",
			"Content-Type" : "application/x-www-form-urlencoded"
		}
	};

	var clientReq = http.request(reqOptions, function(clientRes) {
		clientRes.setEncoding('utf8');
		clientRes.on('data', function(data) {
			try{
				console.log('Got: ' + data);
				
				var tokens = JSON.parse(data);
				callback(tokens);
			}catch(e){
				console.log(e.stack);
			}
		});
	});
	clientReq.on('error', function(e) {
		console.log(e.stack);
		console.log('problem with resolveTokens: ' + e.message);
	});
	clientReq.write('grant_type=authorization_code&code=' + code
		+ '&scope=' + config.authId + '.' + manifest.version);
	clientReq.end();
	console.log('resolveTokens() ing... %s%s%s',config.hostname, (config.port ? ':'+ config.port: ''), config.path + '/auth/token');
}

function refreshTokens(refreshToken, callback) {
	var reqOptions = {
		hostname : config.hostname,
		port: config.port,
		path: config.path + '/auth/token',
		method: 'POST',
		auth: config.authId +':',
		headers: {
			"Accept" : "application/json",
			"Content-Type" : "application/x-www-form-urlencoded"
		}
	};

	var clientReq = http.request(reqOptions, function(clientRes) {
		clientRes.setEncoding('utf8');
		clientRes.on('data', function(data) {
			console.log('Got: ' + data);
			var tokens = JSON.parse(data);
			var err = handleRemoteError(tokens);
			if(err)
				callback({}, '', err);
			else
				callback(tokens, data);
		});
	});
	clientReq.on('error', function(e) {
		console.log(e);
		console.log('problem with resolveTokens: ' + e.message);
		callback({}, e.message);
	});
	clientReq.write('grant_type=refresh_token'
			+ '&refresh_token=' + encodeURIComponent(refreshToken)
			+ '&scope=' + config.authId + '.' + manifest.version);
	clientReq.end();
}

function revokeToken(accessToken, callback) {
	var reqOptions = {
		hostname : config.hostname,
		port: config.port,
		path: config.path + '/auth/token',
		method: 'DELETE',
		auth: config.authId +':',
		headers: {
			"Accept" : "application/json",
			"Authorization" : "Bearer " + accessToken
		}
	};

	var clientReq = http.request(reqOptions, function(clientRes) {
		clientRes.setEncoding('utf8');
		clientRes.on('data', function(data) {
			console.log('Got: ' + data);
			var err;
			try{
				var obj = JSON.parse(data);
				err = handleRemoteError(obj);
			}catch(e){
			}
			if(err)
				callback({}, err);
			else
				callback(data);
		});
	});
	clientReq.on('error', function(e) {
		console.log(e);
		console.log('problem with revoke token: ' + e.message);
		callback({}, e.message);
	});
	clientReq.end();
}

function makeDemoAPICall(uri, accessToken, callback) {
	var reqOptions = {
		hostname : config.hostname,
		port: config.port,
		path: config.path + uri,
		headers: {
			"Accept" : "application/json",
			"Authorization" : "Bearer " + accessToken
		}
	};

	http.get(reqOptions, function(res) {
		res.on('data', function(data) {
			console.log('makeDemoAPICall response: '+ data);
			console.log("API response: " + data);
			callback(data);
		});
	}).on('error', function(e) {
			console.log(e);
			console.log('problem with makeDemoAPICall: ' + e.message);
	});;
}

function handleRemoteError(dataJson){
	if(dataJson.error)
		return util.format('Failure: %j', dataJson);
	return null;
}

module.exports = router;