var url = require('url');
var manifest = require('./manifest/manifest.json');

config = {
	/**  change this 'localhost' URL to your public URL for testing 
		a browser accessing from outside world
	*/
	thirdPartyEndpoint: 'http://tranquil-chamber-5614.herokuapp.com/service',
	
	/** Change this line to the exact address that Tradeshift provides to you */
	//tradeshiftEndpoint: 'https://api.tradeshift.com/tradeshift',
	tradeshiftEndpoint: 'https://api-cn-sandbox.tradeshift.com/tradeshift',
	//tradeshiftEndpoint: 'http://localhost:8889/tradeshift-proxy',

	authId: manifest.vendor_id + '.'+ manifest.app_id,
	
	/** replace it with your own client secret password which is setup in App uploador page */
	authSecret: 'niubi'
};

var tsEndpoint = url.parse(config.tradeshiftEndpoint);
config.hostname = tsEndpoint.hostname;
config.port = tsEndpoint.port;
config.protocol = tsEndpoint.protocol;
config.path = tsEndpoint.path;
config.thirdPartyHost = url.parse(config.thirdPartyEndpoint).hostname;
module.exports = config;
