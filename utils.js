var Artsy = {}

Artsy.UrlGen = function(){
	var key = "dtleuaslkd6qxspmwfwzmgmq";
	var url = "https://openapi.etsy.com/v2/{controller}/{method}.js?api_key="+key;

	return {
		makeURL: function(controller,method){
			return url.replace("{controller}",controller).replace("{method}",method);
		}
	}
}



Artsy.Util = {}

Artsy.Util.tokenize = function (querystring) {
	// remove any preceding url and split
	querystring = querystring.substring(querystring.indexOf('#')+1).split('&');
	var params = {}, pair, d = decodeURIComponent;
	// march and parse
	for (var i = querystring.length - 1; i >= 0; i--) {
		pair = querystring[i].split('=');
		params[d(pair[0])] = d(pair[1]);
	}

	return params;
}

Artsy.Util.fillTemplate = function(data,template){
	var walktree = function(object,path){
		var p = path.splice(0,1)[0];
		if (object[p] != null){
			if (path.length == 0)
				return object[p];
			else
				return walktree(object[p],path);
		}
		else
			return null;
	}

	var res = template;
	var matches = res.match(/\{\w+\}/g);
	for(i in matches)
	{
		var field = matches[i].replace("{","").replace("}","");
		res = res.replace("{"+field+"}",walktree(data,field.split(".")));
	}

	return res;
}

Artsy.Util.makepath = function (params) {
	var res = "";
	for(e in params)
		res += e + "=" + encodeURIComponent(params[e]) + "&";
	return res;
}