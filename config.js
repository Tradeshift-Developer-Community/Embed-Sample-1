var url = require('url');
var manifest = require('./manifest/manifest.json');

config = {
	/** Change this line to the exact address that Tradeshift provides to you */
	//tradeshiftEndpoint: 'https://api.tradeshift.com/tradeshift',
	tradeshiftEndpoint: 'https://api-sandbox.tradeshift.com/tradeshift',
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
if(!config.thirdPartyEndpoin){
	config.thirdPartyEndpoint = manifest.app.redirect_uri;
}
config.thirdPartyHost = url.parse(config.thirdPartyEndpoint).hostname;
module.exports = config;

