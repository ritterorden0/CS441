var map, infoWindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {center: {lat: 56.1304, lng: -106.3468}, zoom: 6});
	
	infoWindow = new google.maps.InfoWindow;
	directionsService = new google.maps.DirectionsService; //should this be global?
	directionsDisplay = new google.maps.DirectionsRenderer; //should this be gloabal?
	directionsDisplay.setMap(map); //the directions will be set to be displayed on the map variable
	directionsDisplay.setPanel(document.getElementById('directionsPanel'));

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
	var tbl = document.getElementById("addrList");
	var last = tbl.rows.length;
	while (last > 3) {
		document.getElementById("addrList").deleteRow(last-2);
		--last;
	}
	document.getElementById("addrList").reset();
}

//returns the value of the radio button if its either walk or drive,  ***note this is implemented in a not so-scalable way
function getTravelModeRadioButton() {
	
	var val = "";
	if(document.getElementById("driveSetting").checked)
		val = document.getElementById("driveSetting").value; //nodeValue or value ???
	else val = document.getElementById("walkSetting").value; //nodeValue or value ???
	return val;
}



function submitForm() {
	//document.getElementById("addrList").reset(); // why reset() ...placeholder??
	
	//myWayPoints = []; //an array that will contain all waypoint stops, including start and end locations.	
	//two hardcoded addresses for testing
	//myWayPoints.push({location: "San Marcos, Texas", stopover: true});
	//myWayPoints.push({location: "San Marcos, California", stopover: true});

	var userInputAddressses = []; //this is an array that will hold the textboxes (not just the values of the textboxes)
	userInputAddresses = document.getElementsByName("userWaypointInputs"); //the array is now holding all textboxes with the attribute name "userWaypointInputs"
	var numOfWaypoints = userInputAddresses.length;

	var routeWaypoints = []; //an array that will contain all waypoint stops, including start and end locations.	

	for(var i = 0; i < numOfWaypoints; ++i)
	{
		routeWaypoints.push({location: userInputAddressses[i].value, stopover: true}); //adds waypoints/orgin/destination with user input addresses to the array
	}

	//travelMode setting variable ...driving or walking option can be selected
	var modeOfTravel = getTravelModeRadioButton(); //the result of getTravelModeRadioButton is put into travelMode (string)

	//avoid toll roads setting. avoidTollRoads is boolean value; determines to skip or not skip toll roads 
	var avoidTollRoads = document.getElementById("tollSetting").checked

	// origin and destination based on the provided input
	 var ori = document.getElementById("addr1").value;
	 var dest = document.getElementById("addrEnd").value;

	 if (ori == "" || dest == "")
	 {
		alert("A start address and end address is required");
	 }
	 else {
	//calls the google service api's direction service function, calculates the route.  (doesnt do the displaying)
	directionsService.route({
	  origin: ori,
	  destination: dest,
	  waypoints: routeWaypoints,
	  optimizeWaypoints: true,
	  travelMode: modeOfTravel,
	  avoidTolls: avoidTollRoads,
	}, function(response, status) {
	  if (status === 'OK') {
		directionsDisplay.setDirections(response);
	  } else {
		window.alert('Directions request failed due to ' + status);
	  }
	});

	document.getElementById('settings').style.visibility= "hidden";
	document.getElementById('main').style.visibility= "hidden";
	document.getElementById('directionsPanel').style.visibility= "visible";
	 }
}

function addAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length-1;
	var iter = lastRow-1;
	var row = tbl.insertRow(lastRow);

	var cell0 = row.insertCell(0);
	var textNode0 = document.createTextNode(iter);
	cell0.appendChild(textNode0);

	var cell1 = row.insertCell(1);
	var textBox = document.createElement("INPUT");
	textBox.setAttribute("type", "text");
	textBox.setAttribute("name","userWaypointInputs"); //all text boxes will have their name attirbute the same ("userWaypointInputs")
	cell1.appendChild(textBox);
}

function remAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length -1;
	if (lastRow > 2) tbl.deleteRow(lastRow - 1);
}

function returnHomeFunction() {
	document.getElementById("main").style.visibility = "visible";
	document.getElementById("settings").style.visibility = "hidden";
	document.getElementById("directionsPanel").style.visibility = "hidden";
}

function returnOptionsFunction() {
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("settings").style.visibility = "visible";
	document.getElementById("directionsPanel").style.visibility = "hidden";
}

function returnDirectionsFunction() {
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("settings").style.visibility = "hidden";
	document.getElementById("directionsPanel").style.visibility = "visible";
}