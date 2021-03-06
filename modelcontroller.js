Artsy.Listing = function(){
	var urlGen = new Artsy.UrlGen();

	var getCache = function(key,successcallback,fallback){
		if(typeof(Storage)!=="undefined"){
			if (sessionStorage[key] != null)
				successcallback(JSON.parse(sessionStorage[key]).data);
			else
				fallback(function(result){
					try {
						sessionStorage[key] = JSON.stringify({age:(new Date).getTime(),data:result});
					}
					catch (err) {
						for(item in sessionStorage)
							if (JSON.parse(sessionStorage[item]).age < ((new Date).getTime() - 3600000))
								sessionStorage.removeItem(item);
						try {
							sessionStorage[key] = JSON.stringify({age:(new Date).getTime(),data:result});
						}
						catch (err) {}
					}
				});
		}
		else
			fallback(function(){});
	}

	var search = function(callback,	params){
		var key = Artsy.Util.makepath(params);
		getCache(key,
			function(data){
				data = filteritems(data);
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
		                	data = filteritems(data);
		                	callback(data);
		                } else {
		                    callback(null);
		                }
		            },
		            error: function(){
	                    callback(null);
		            }
		        });
    		}
		);
	}

	var hideitem = function(listingid){
		if(typeof(Storage)!=="undefined"){
			var key = "hide-"+listingid;
			if (localStorage.getItem(key) == null)
				localStorage.setItem(key,"hide");
		}
	}

	var filteritems = function(items){
		if(typeof(Storage)!=="undefined")
			for(var i=items.results.length-1;i>=0;i--)
				if (localStorage.getItem("hide-"+ items.results[i].listing_id + ""))
					items.results.splice(i,1);

		return items;
	}

	return {
		search: search,
		hideitem: hideitem,
		sorters: ["created", "price", "score" ]
	}
}



Artsy.SearchController = function(){
	var searcher, searchform, searchresultsview, searchdetailsview, loadingview;
	var searchcriteria = {};
	var searchresults;

	var search = function(){
		searchcriteria.sort_on = searchresultsview.getSortOrder();
		searchcriteria.keywords = searchform.getSearchCriteria();
		searchcriteria.page = 1;
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var nextpage = function(){
		searchcriteria.page++;
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var prevpage = function(){
		if (searchcriteria.page>1) searchcriteria.page--;
		location.hash = Artsy.Util.makepath(searchcriteria);
	}

	var details = function(){
		listingid = $(this).closest("[data-id]").attr("data-id");
		for (var item in searchresults.results)
			if (searchresults.results[item].listing_id == listingid){
				searchdetailsview.render(searchresults.results[item]);
			}
	}

	var hideitem = function(event){
		listingid = $(this).closest("[data-id]").attr("data-id");
		searcher.hideitem(listingid)
		event.stopPropagation();
		navigate();
	}

	var navigate = function(){
		searchcriteria = Artsy.Util.tokenize(location.hash);
		searchform.render(searchcriteria.keywords,"searchform");

		if (location.hash != ""){
			loadingview.render(true);
			searchresultsview.render(null);
			searcher.search(function(data){
				loadingview.render(false);
				searchresults = data;
				searchcriteria.page = data.pagination.effective_page;
				searchresultsview.render(searchresults);
			},searchcriteria);
		}
	}

	return {
		search : search,
		searcher: searcher,
		searchform: searchform,
		searchresults: searchresultsview,
		searchdetailsview: searchdetailsview,
		loadingview: loadingview,
		details: details,
		nextpage: nextpage,
		prevpage: prevpage,
		hideitem: hideitem,
		init : function(){
			searcher = new Artsy.Listing();

			searchform = new Artsy.SearchFormView({Controller: this});
			searchresultsview = new Artsy.SearchResultsView({Controller: this});
			searchdetailsview = new Artsy.SearchDetailsView({Controller: this});
			loadingview = new Artsy.LoadingView({Controller: this});

			searchform.render("","searchform");
			searchresultsview.render(null,"searchresults");
			searchdetailsview.render(null,"listingdetail");
			loadingview.render(null,"loading");

			$(window).on('hashchange', navigate);
			if (location.hash != "") navigate();
		}
	}
}
