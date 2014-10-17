Tradeshift Third-party App Demo
==================

This is a demo app for demostrating how third-party app developer can use Tradeshift OAuth2 and API plateform to build a simplest web server application.

This demo app is written in Node.js.

For the details of building an app upon Tradeshift platform, please refer to http://developer.tradeshift.com/

If you have already had a Developer role in Tradeshift platform, to run this demo app:

- Modify `manifest/manifest.json`
    - make sure the `vendor_id` is the same vendor id that you use in Tradeshift developer account
    - a valid `version` number must match pattern: ^(d+)(.d+)?(.d+)?(-[0-9a-zA-Z]*)?$
- Upload `manifest/manifest.json` through Tradeshift Third-party app uploader page, please refer to http://developer.tradeshift.com/ for details
- Modify `config.js` file, change `tradeshiftEndpoint` to exact information that Tradeshift provides to you (Tradeshift test sandbox or production endpoint address),
	`thirdPartyEndpoint` should be the address where you deploy this demo app, make sure this is a public internet address for accessing from outside if you want to test connection from some place other than your localhost.
- Make sure you have installed Node.js
- Go to root fold of this demo app, execute command `npm install` for the first time you run this demo app
- Start demo app server by execute command `bin/www`

