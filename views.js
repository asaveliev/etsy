Artsy.SearchFormView = function(params){
	var controller = params.Controller;
	var template = "<div class='searchform'><form><input class='textfield' value='{Criteria}' /> \
		<input type='button' class='searchbutton' value='Search' /></form> \
	</div>";
	var events = {
		".searchbutton" : ["click",controller.search],
		"form"          : ["submit",controller.search]
	}
	var id;


	return {
		render : function(criteria,htmlid){
			if (htmlid != null) id = htmlid;
			$("#"+id).html(template.replace("{Criteria}",criteria));

			for(e in events)
				$("#"+id + " " + e).on(events[e][0],events[e][1]);
		},
		getSearchCriteria: function(){
			return $("#"+id+" .textfield").val();
		}
	}
}

Artsy.SearchResultsView = function(params){
	var controller = params.Controller;
	var containertemplate = "<div class='searchresults'> \
		<div class='pager'>{Pager}</div> \
		<div class='sorter'>Order by <select>{Sorters}</select></div> \
		<div class='itemlist'>{Content}</div> \
	</div>";
	var pagertemplate = "<div class='pager'>{count} found <a class='prevpage'>&lt;prev </a> <a class='nextpage'>next&gt;</a></div>";

	var itemtemplate = " \
		<div class='item' data-id='{listing_id}'><span class='title'>{title}</span><br /><span class='price'>{price} {currency_code}</span></div> \
	";
	
	var events = {
		".sorter"     : ["change",  controller.search],
		".item"       : ["click",   controller.details],
		".nextpage"   : ["click",   controller.nextpage],
		".prevpage"   : ["click",   controller.prevpage]
	};
	var id;

	var renderSorters = function(){
		var s = new Artsy.Listing();
		var res = "";
		for(sorter in s.sorters)
			res += "<option>"+s.sorters[sorter]+"</option>"
		return res;
	}

	var renderResults = function(data){
		var res = "";
		if (data != null)
			for(listing in data.results)
				res += Artsy.Util.fillTemplate(data.results[listing],itemtemplate) 
		return res;
	}

	var render = function(data,htmlid){
		if (htmlid != null) id = htmlid;
		var resulthtml = "";
		if (data != null){
			var results = renderResults(data);
			var sorters = renderSorters();
			var pager = Artsy.Util.fillTemplate(data,pagertemplate);

			resulthtml = containertemplate.replace("{Content}",results).replace("{Sorters}",sorters).replace("{Pager}",pager);
		}

		$("#"+id).html(resulthtml);
		for(e in events)
			$("#"+id + " " + e).on(events[e][0],events[e][1]);
	}

	return {
		render : render,
		setData: function(data){
			data = data;
			this.render();
		},
		getSortOrder: function(){
			return $("#"+id+" .sorter select").val();
		}
	}
}

Artsy.SearchDetailsView = function(params){
	var controller = params.Controller;
	var template = "<div class='listingdetailcontainer'><div class='listingdetail' data-id='{listing_id}''> \
		<div class='listingshopsection'>{Shop.shop_name} / {Section.title}</div> \
		<div class='listingcategory'><span class='heading'>Category:</span>           <span class='value'>{category_path}</span></div> \
		<div class='listingtitle'><a href='{url}' target='_blank'>{title}</a></div> \
		<div class='images'>{Images}</div> \
		<div class='listingdescription'>{description}</div> \
		<div class='listingtags'>{tags}</div> \
		<div class='listingsocial'>Views: {views} Likes: {num_favorers}</div> \
		<div class='listingdetailline'><span class='heading'>Status :</span>          <span class='value'>{state}</span></div> \
		<div class='listingdetailline'><span class='heading'>User :</span>            <span class='value'>{User.login_name}</span></div> \
		<div class='listingdetailline'><span class='heading'>Created :</span>         <span class='value'>{creation_tsz}</span></div> \
		<div class='listingdetailline'><span class='heading'>Ends :</span>            <span class='value'>{ending_tsz}</span></div> \
		<div class='listingdetailline'><span class='heading'>Price :</span>           <span class='value'>{price} {currency_code}</span></div> \
		<div class='listingdetailline'><span class='heading'>Quantity :</span>        <span class='value'>{quantity}</span></div> \
		<div class='listingdetailline'><span class='heading'>Materials :</span>       <span class='value'>{materials}</span></div> \
		<div class='listingdetailline'><span class='heading'>Processing time :</span> <span class='value'>{processing_min} - {processing_max} days</span></div> \
		<div class='listingdetailline'><span class='heading'>Made by :</span>         <span class='value'>{who_made}</span></div> \
		<div class='listingdetailline'><span class='heading'>Supply :</span>          <span class='value  {is_supply}'></span></div> \
		<div class='listingdetailline'><span class='heading'>Made in :</span>         <span class='value'>{when_made}</span></div> \
		<div class='listingdetailline'><span class='heading'>Made for :</span>        <span class='value'>{recipient}</span></div> \
		<div class='listingdetailline'><span class='heading'>Occasion :</span>        <span class='value'>{occasion}</span></div> \
		<div class='listingdetailline'><span class='heading'>Style :</span>           <span class='value'>{style}</span></div> \
		<div class='listingdetailline'><span class='heading'>Non-taxable :</span>     <span class='value  {non_taxable}'></span></div> \
		<div class='listingdetailline'><span class='heading'>Customizable :</span>    <span class='value  {is_customizable}'></span></div> \
		<div class='listingdetailline'><span class='heading'>Digital media:</span>    <span class='value  {is_digital}'></span></div> \
		<div class='listingdetailline'><span class='heading'>Variations :</span>      <span class='value  {has_variations}'></span></div> \
		<div class='listingshipping'><span class='heading'>Shipping :</span>        <span class='value'>{Shipping}</span></div> \
	</div></div>";
	var imagetemplate = "<img src='{url_170x135}'></img>";
	var shippingtemplate = "<span class='shippingcountry'>{destination_country_name} :</span> {primary_cost} {currency_code}";
	var shippingsecondarytemplate = " ({secondary_cost} {currency_code} with another item)";
	var events = {
		".searchbutton" : ["click",controller.search]
	}
	var id;


	return {
		render : function(data,htmlid){
			if (htmlid != null) id = htmlid;
	
			if (data != null){
				data.creation_tsz = new Date(data.creation_tsz * 1000);
				data.ending_tsz = new Date(data.ending_tsz * 1000);
				data.when_made = data.when_made.replace("_"," - ");
				var res = template;
				var imagesres = "";
				for(image in data.Images)
					imagesres += Artsy.Util.fillTemplate(data.Images[image],imagetemplate);
				res = res.replace("{Images}",imagesres);

				var shippingres = "";
				for(ship in data.ShippingInfo){
					shippingres += Artsy.Util.fillTemplate(data.ShippingInfo[ship],shippingtemplate);
					if (data.ShippingInfo[ship].secondary_cost > 0)
						shippingres += Artsy.Util.fillTemplate(data.ShippingInfo[ship],shippingsecondarytemplate);
					else
						shippingres += "<br />";
				}
				res = res.replace("{Shipping}",shippingres);

				res = Artsy.Util.fillTemplate(data,res);
			}
			else
				res = "";


			$("#"+id).html(res);

			for(e in events)
				$("#"+id + " " + e).on(events[e][0],events[e][1]);
		}
	}
}