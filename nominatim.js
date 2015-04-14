var map;

jQuery(document).ready(function() {
	// create a map in the "map" div, set the view to a given place and zoom
	map = L.map('map');

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

    // popup donde haga click en el mapa
	var popup = L.popup();
	function onMapClick(e) {
		//alert("You clicked the map at " + e.latlng);
    	popup
        	.setLatLng(e.latlng)
        	.setContent("Has hecho click en: " + e.latlng.toString())
        	.openOn(map);
	}
	map.on('click', onMapClick);

	//localizacion
	map.locate({setView: true, maxZoom: 16});
	function onLocationFound(e) {
    	var radius = e.accuracy / 2;
    	L.marker(e.latlng).addTo(map)
        	.bindPopup("Estas a " + radius + " metros alrededor de este punto").openPopup();
    	L.circle(e.latlng, radius).addTo(map);
	}
	map.on('locationfound', onLocationFound);

	function onLocationError(e) {
    	alert(e.message);
	}
	map.on('locationerror', onLocationError);
});


function chooseAddr(lat, lng, type) {
  	var location = new L.LatLng(lat, lng);
  	map.panTo(location);

  	if (type == 'city' || type == 'administrative') {
    	map.setZoom(11);
  	} else {
    	map.setZoom(13);
  	}
}

function addr_search() {
  	var inp = document.getElementById("addr");
    
  	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
  		var items = [];

		  $.each(data, function(key, val) {
  		  items.push(
    	  "<li><a href='#' onclick='chooseAddr(" +
    	  val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
    	  '</a></li>'
    	  );
  	  });

  	  $('#results').empty();
    	if (items.length != 0) {
      	$('<p>', { html: "Search results:" }).appendTo('#results');
      	$('<ul/>', {
        	'class': 'my-new-list',
        	html: items.join('')
      	}).appendTo('#results');

        $('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
        $('#close').click(removeResults);

        imgs_search(inp);

    	} else {
      	$('<p>', { html: "No results found" }).appendTo('#results');
    	}   		
  	});	
}

function removeResults() {
  $('#results').empty();
}

function imgs_search(e) {
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?tagmode=any&format=json&jsoncallback=?";

  $('<p>', { html: "Images:" }).appendTo('#results');
    $.getJSON(flickerAPI, {
      tags: e.value,
    }).done(function(data) {
    $.each(data.items, function(i, item) {
      $("<img>").attr("src", item.media.m).appendTo("#results");
      if (i === 3) {
        return false;
      } 
    });
  });
}