Artsy.Listing = function(){
	var urlGen = new Artsy.UrlGen();

	var getCache = function(key,successcallback,fallback){
		if(typeof(Storage)!=="undefined"){
			if (sessionStorage[key] != null)
				successcallback(JSON.parse(sessionStorage[key]));
			else
				fallback(function(result){
					sessionStorage[key] = JSON.stringify(result);
				});
		}
		else
			fallback(function(){});
	}

	var search = function(callback,	params){
		var key = Artsy.Util.makepath(params);
		getCache(key,
			function(data){
				callback(data);
			},
			function(cachecallback){
				var url = urlGen.makeURL("listings","active") +
					"&includes=Images,ShippingInfo,Shop,Section,User,PaymentInfo"
		        $.ajax({
		            url: url,
		            data: params,
		            dataType: 'jsonp',
		            success: function(data) {
		                if (data.ok) {
		                	cachecallback(data);
		                	callback(data);
		                } else {
		                    return null;
		                }
		            }
		        });
    		}
		);
	}

	return {
		search: search,
		sorters: ["created", "price", "score" ]
	}
}



Artsy.SearchController = function(){
	var searcher, searchform, searchresultsview, searchdetailsview;
	var searchcriteria = {};
	var searchresults;

	var search = function(){
		searchcriteria.sort_on = searchresultsview.getSortOrder();
		searchcriteria.keywords = searchform.getSearchCriteria();
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var nextpage = function(){
		searchcriteria.page++;
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var prevpage = function(){
		if (searchcriteria.page>0) searchcriteria.page--;
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var details = function(){
		listingid = $(this).attr("data-id");
		for (item in searchresults.results)
			if (searchresults.results[item].listing_id == listingid){
				searchdetailsview.render(searchresults.results[item]);
			}
	}

	var navigate = function(){
		searchcriteria = Artsy.Util.tokenize(location.hash);
		searchform.render(searchcriteria.keywords,"searchform");

		if (location.hash != "")
			searcher.search(function(data){
				searchresults = data;
				searchcriteria.page = data.pagination.effective_page;
				searchresultsview.render(searchresults);
			},searchcriteria);
	}

	return {
		search : search,
		searcher: searcher,
		searchform: searchform,
		searchresults: searchresultsview,
		searchdetailsview: searchdetailsview,
		details: details,
		nextpage: nextpage,
		prevpage: prevpage,
		init : function(){
			searcher = new Artsy.Listing();

			searchform = new Artsy.SearchFormView({Controller: this});
			searchresultsview = new Artsy.SearchResultsView({Controller: this});
			searchdetailsview = new Artsy.SearchDetailsView({Controller: this});

			searchform.render("","searchform");
			searchresultsview.render(null,"searchresults");
			searchdetailsview.render(null,"listingdetail");

			$(window).on('hashchange', navigate);
			if (location.hash != "") navigate();
		}
	}
}
