var express = require('express');

var path = require('path');
var util = require('util');
var Q = require('q');
var router = express.Router();
var config = require('../config.js');
var http = config.protocol == 'http:'? require('http') : require('https');
var manifest = require('../manifest/manifest.json');

router.get('/', function(req, res) {
	console.log('/service?code='+ req.query.code);
	if(req.query.code) {
		resolveTokens(req.query.code).then(function(tokens) {
			console.log('tokens: %j', tokens);
			req.session.oauth2AccessToken = tokens.access_token;
			req.session.oauth2RefreshToken = tokens.refresh_token;
			req.session.oauth2Response = JSON.stringify(tokens, null, '  ');
			res.redirect('/');
		}).catch(function(error){
			res.send(500, error +', remote data: "' + error.data +'"\n' + error.stack);
			console.log('Error: %s\n%s', error, error.stack);
		}).done();
	} else {
		res.send(400,'Bad Request');
	}

});


router.get('/refresh-token', function(req, res) {
	console.log('refresh token: %s', req.session.oauth2RefreshToken);
	refreshTokens(req.session.oauth2RefreshToken).then(function(tokens){
		req.session.oauth2AccessToken = tokens.access_token;
		req.session.oauth2Response = JSON.stringify(tokens, null, '  ');
		res.send(req.session.oauth2Response);
	}).catch(function(error){
		res.send(500, error +', remote data: "' + error.data +'"\n' + error.stack);
		console.log('Error: %s\n%s', error, error.stack);
	}).done();
});

router.get('/revoke-token', function(req, res) {
	revokeToken(req.session.oauth2AccessToken).then(function(data, error){
		if(error){
			res.send(error);
			return;
		}
		res.send(data);
	}).catch(function(error){
		res.send(500, error +', remote data: "' + error.data +'"\n' + error.stack);
		console.log('Error: %s\n%s', error, error.stack);
	}).done();
});

router.get('/account-api', function(req, res) {
		makeDemoAPICall('/rest/external/account/info', req.session.oauth2AccessToken).then(function(data) {
			res.send(data);
		}).catch(function(error){
			res.send(500, error + '\n' + error.stack );
			console.log('Error: %s\n%s', error, error.stack);
		}).done();
});

router.get('/connection-api', function(req, res) {
	makeDemoAPICall('/rest/external/network', req.session.oauth2AccessToken).then(function(data) {
		res.send(data);
	}).catch(function(error){
		res.send(500, error + '\n' + error.stack );
		console.log('Error: %s\n%s', error, error.stack);
	}).done();
});

router.get('/invoice-api', function(req, res) {
	makeDemoAPICall('/rest/external/documents/?type=invoice', req.session.oauth2AccessToken).then( function(data) {
		res.send(data);
	}).catch(function(error){
		res.send(500, error + '\n' + error.stack );
		console.log('Error: %s\n%s', error, error.stack);
	}).done();
});

function resolveTokens(code) {
	var def = Q.defer();
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
				def.resolve(tokens);
			}catch(ex){
				ex.data = data;
				def.reject(ex);
			}
		});
	});
	clientReq.on('error', function(e) {
		console.log(e.stack);
		console.log('problem with resolveTokens: ' + e.message);
		def.reject(e);
	});
	clientReq.write('grant_type=authorization_code&code=' + code
		+ '&scope=' + config.authId + '.' + manifest.version);
	clientReq.end();
	console.log('resolveTokens() ing... %s%s%s',config.hostname, (config.port ? ':'+ config.port: ''), config.path + '/auth/token');
	return def.promise;
}

function refreshTokens(refreshToken) {
	return Q.Promise(function(resolve, reject){
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
				console.log('Got: ' + data);
				try{
					var tokens = JSON.parse(data);
					var err = handleRemoteError(tokens);
					if(err)
						reject(err);
					else
						resolve(tokens);
				}catch(ex){
					ex.data = data;
					reject(ex);
				}
			});
		});
		clientReq.on('error', function(e) {
			console.log(e);
			console.log('problem with resolveTokens: ' + e.message);
			reject(e);
		});
		clientReq.write('grant_type=refresh_token'
				+ '&refresh_token=' + encodeURIComponent(refreshToken)
				+ '&scope=' + config.authId + '.' + manifest.version);
		clientReq.end();
	});
}

function revokeToken(accessToken, callback) {
	var def = Q.defer();
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
			if(data.toUpperCase() == 'OK'){
				def.resolve(data);
				return;
			}
			var err;
			try{
				var obj = JSON.parse(data);
				err = handleRemoteError(obj);
			}catch(e){
				e.data = data;
				def.reject(e);
			}
			if(err)
				def.reject(err);
		});
	});
	clientReq.on('error', function(e) {
		def.reject(e);
	});
	clientReq.end();
	return def.promise;
}

function makeDemoAPICall(uri, accessToken, callback) {
	var def = Q.defer();
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
			def.resolve(data);
		});
	}).on('error', function(e) {
			def.reject(e);
	});
	return def.promise;
}

function handleRemoteError(dataJson){
	if(dataJson.error)
		return util.format('Failure: %j', dataJson);
	return null;
}

module.exports = router;