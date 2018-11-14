var map, infoWindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {center: {lat: 56.1304, lng: -106.3468}, zoom: 6});
	
	infoWindow = new google.maps.InfoWindow;
	directionsService = new google.maps.DirectionsService; //should this be global?
	directionsDisplay = new google.maps.DirectionsRenderer; //should this be gloabal?
	directionsDisplay.setMap(map); //the directions will be set to be displayed on the map variable

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {lat: position.coords.latitude, lng: position.coords.longitude};
			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	}
	else {
		handleLocationError(false, infoWindow, map.getCenter());
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
		infoWindow.open(map);
	}
}

function resetForm() {
	document.getElementById("addrList").reset();
}

function submitForm() {
	//document.getElementById("addrList").reset(); // why reset() ...placeholder??
	
	myWayPoints = []; //an array that will contain all waypoint stops, including start and end locations.
		
	//two hardcoded addresses for testing
	myWayPoints.push({location: "San Marcos, Texas", stopover: true});
	myWayPoints.push({location: "San Marcos, California", stopover: true});

	//calls the google service api's direction service function, calculates the route.  (doesnt do the displaying)
	directionsService.route({
	  origin: "California",
	  destination: 'Utah',
	  waypoints: myWayPoints,
	  optimizeWaypoints: true,
	  travelMode: 'DRIVING'
	}, function(response, status) {
	  if (status === 'OK') {
		directionsDisplay.setDirections(response);
	  } else {
		window.alert('Directions request failed due to ' + status);
	  }
	});

}

function addAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length;
	var iter = lastRow;
	var row = tbl.insertRow(lastRow);

	var cell0 = row.insertCell(0);
	var textNode0 = document.createTextNode(iter);
	cell0.appendChild(textNode0);

	var cell1 = row.insertCell(1);
	var textBox = document.createElement("INPUT");
	textBox.setAttribute("type", "text");
	cell1.appendChild(textBox);
}

function remAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length;
	if (lastRow > 2) tbl.deleteRow(lastRow - 1);
}

/* Options menu open */
function openOpt() {
    document.getElementById("settings").style.display = "block";
}
/* options menu close */
function closeOpt() {
    document.getElementById("settings").style.display = "none";
}