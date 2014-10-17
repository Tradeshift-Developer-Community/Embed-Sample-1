var url = require('url');
var manifest = require('./manifest/manifest.json');

config = {
	/**  change this 'localhost' URL to your public URL for testing 
		a browser accessing from outside world
	*/
	thirdPartyEndpoint: 'https://tranquil-chamber-5614.herokuapp.com/service',
	
	/** Change this line to the exact address that Tradeshift provides to you */
	//tradeshiftEndpoint: 'https://api.tradeshift.com/tradeshift',
	tradeshiftEndpoint: 'https://api-sandbox.tradeshift.com/tradeshift',
	//tradeshiftEndpoint: 'http://localhost:8889/tradeshift-proxy',
	/** For Tradeshift internal developers:
	tradeshiftEndpoint: 'https://api-apps-sandbox.tradeshift.com/tradeshift',
	tradeshiftEndpoint: 'http://localhost:8889/tradeshift-proxy',
	*/
	authId: manifest.vendor_id + '.'+ manifest.app_id
};

var tsEndpoint = url.parse(config.tradeshiftEndpoint);
config.hostname = tsEndpoint.hostname;
config.port = tsEndpoint.port? tsEndpoint.port:80;
config.path = tsEndpoint.path; 
module.exports = config;
