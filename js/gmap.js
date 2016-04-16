window.addEventListener('load', initMap);

var map;
var marker;

// function to initialize map with its properties and marker inside the map
function initMap() {
	var lat = $("#lat").text();
	var lon = $("#lon").text();
	var LatLng = new google.maps.LatLng(lat, lon);
	
	map = new google.maps.Map($("#map")[0], {
	center: LatLng,
	zoom: 13, 
	mapTypeId:google.maps.MapTypeId.ROADMAP,
	mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
	});
	
	marker = new google.maps.Marker({
	position: LatLng,
	map:map,
	title: 'Image Location'
	});
}

// function for button that take set screen centre to marker
function toMarker() {
	map.setZoom(13);
	map.panTo(marker.getPosition());
}