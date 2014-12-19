Tradeshift Third-party App Demo
==================

This is a demo application to demonstrate Tradeshift's API platform and Ouath 2, for a simple embeddable application that calls common API methods.
This demo is written in Node.js.

For the details of building an app upon Tradeshift platform, please refer to http://developer.tradeshift.com/

If you have already had a Developer role in Tradeshift platform, to run this demo app:

   1. Modify `manifest/manifest.json`
       * make sure the `vendor_id` is the same vendor id that you use in Tradeshift developer account
       * a valid `version` number must match pattern: ^(d+)(.d+)?(.d+)?(-[0-9a-zA-Z]*)?$
       * `app_id` should match pattern: ([a-z][a-z0-9]+)
       * `externalurl` should always be `true`
       * `app/main` is the URL of your app's main entry address which will also be embedded Tradeshift's iframe window
       * `app/redirect_uri` is the OAuth2 login redirect URI which will retrieve the authorization code from Tradeshift once user logins successfually
       * `capabilities/access` represents the access rights required by this app, and will be present to user for authorization during app activation phase
         + Avaiblable access permissions are `openidconnect`, `group_view`, `group_edit`, `document_view`, `document_create`, `document_send`, `document_delete`, `document_tag`, `network_view`, `network_create`, `network_delete`, `validation_view`, `validation_create`, `validation_delete`, `campaign_view`, `campaign_edit`, `user_add`, `job_view`, `job_edit`, `xsite_signup`, `UpdateCompanyProfile`, `UpdateUserProfile`, `AccessConversation`, `AddComment`, `UpdateConversationState`, `UpdateAttachment`, `UpdateRootDocument`, `Impersonate`, `Share`.
         + `openidconnect` should always be present
       
   2. Reach out to apps@tradeshift.com with a copy of your manifest, and the Tradeshift team will setup your application to test in your account.
   
   3. Modify `config.js` file, change `tradeshiftEndpoint` to exact information that Tradeshift provides to you (Tradeshift test sandbox or production endpoint address),
   	`thirdPartyEndpoint` should be the address where you deploy this demo app, make sure this is a public internet address for accessing from outside if you want to test connection from some place other than your localhost.
   
   4. Make sure you have installed Node.js
   
   5. Go to root fold of this demo app, execute command `npm install` for the first time you run this demo app
   
   5. Start demo app server by execute command `bin/www`

>  The current config setting in master branch is for demostrating an node server hosted on your local environment https://localhost:3000, which is handy setup for your first time test.
   If you only want a plain HTTP service instead of HTTPS, read file `app.js`, simply comment out relevant code snippet.
