if(ts == undefined) {
	var ts = function() {
		function getRequestParam(name) {
		    var s1 = location.search.substring(1, location.search.length).split('&'),
		        r = {}, s2, i;
		    for (i = 0; i < s1.length; i += 1) {
		        s2 = s1[i].split('=');
		        r[decodeURIComponent(s2[0]).toLowerCase()] = decodeURIComponent(s2[1]);
		    }
		    return r[name];
		};



		return 	{
			ready : function() {
				var contextId = /key[0-9]{9}/.exec(getRequestParam('gui-contextid'));

				var titleMessage = 'spiritual-action:{"target":null,"type":"ts-action-g-document-title","data":"Suepr duper Billys Billing!","direction":"ascend","global":true,"$instanceid":"' + contextId + '"}';
				window.frames.top.postMessage(titleMessage, "*");

				var spiritualizedMessage = 'spiritual-action:{"target":null,"type":"gui-action-document-spiritualized","direction":"ascend","global":true,"$instanceid":"' + contextId + '"}';
				window.frames.top.postMessage(spiritualizedMessage, "*");

				var onLoadMessage = 'spiritual-action:{"target":null,"type":"gui-action-document-onload","data":"http://localhost:3000/","direction":"ascend","global":true,"$instanceid":"' + contextId + '"}';
				window.frames.top.postMessage(onLoadMessage, "*");


			}
		};
	}();
}


ts.ready();

// spiritual-action:{"target":null,"type":"ts-action-g-document-title","data":"Profile","direction":"ascend","global":true,"$instanceid":"key168007853"}

// spiritual-action:{"target":null,"type":"gui-action-document-onload","data":"http://localhost:8080/powerapp/public-profile/?companyId=35d164f4-5626-45d0-84b3-34e3428f8cdd","direction":"ascend","global":true,"$instanceid":"key168007853"}