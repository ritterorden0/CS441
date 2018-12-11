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
	var last = tbl.rows.length; //gets total # of rows of the table
	
	//deletes all the waypoint text boxes, the only rows left are the start and end text boxes
	while (last > 3) {
		document.getElementById("addrList").deleteRow(last-2);
		--last;
	}
	document.getElementById("addr1").value = ""; //sets the value in this text box to nothing
	document.getElementById("addrEnd").value = ""; //sets the value in this text box to nothing
	//document.getElementById("addrList").reset();
}

//returns the value of the radio button if its either walk or drive,  ***note this is implemented in a not so-scalable way
function getTravelModeRadioButton() {
	
	var val = "";
	if(document.getElementById("driveSetting").checked)
		val = document.getElementById("driveSetting").value; //nodeValue or value ???
	else val = document.getElementById("walkSetting").value; //nodeValue or value ???
	return val;
}


/*
this algorithm, in a greedy fashion, distributes waypoints to each traveller
the waypoints are reordered in the waypoint_order field of the "response" (DirectionsResult object)
a 2-d array of row length = to numTravellers.  the column is of variable length too.  the column, aside the from row index,
is a list of waypoints that the respective traveller is to traverse (waypoints are not same as orgin and destination)
*/
function greedyDivide(routeResponse, numTravellers)
{
	//get the response's waypoint_order array
	var optimizedWaypointOrder = routeResponse.waypoint_order; //doesn't include the destination or orgin points
	alert(optimizedWaypointOrder[0].location);
	
	//create a 2d array where row is the number of travellers and columns, aside from the traveller index, is their divy-ed out waypoints
	//var travellersWaypoints[numTravellers][];
	//divy out the waypoints in optimizedWaypointOrder array to each traveller
	
	
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
	var numTravellers = document.getElementById("numTravellers").value;
	var routeWaypoints = []; //an array that will contain all waypoint stops, including start and end locations.	

	//adds the waypoints and Start and End locations into the routeWaypoints array
	for(var i = 0; i < numOfWaypoints; ++i)
    {
        if (userInputAddresses[i].value != "") {
            routeWaypoints.push({location: userInputAddresses[i].value, stopover: true}); //adds waypoints/orgin/destination with user input addresses to the array
        }
    }
	//removes start and end from the routeWaypoints array (this prevents origin and destination from appearing in this waypoint array
	routeWaypoints.shift();//shift removes the Front element of the array
	routeWaypoints.pop();//pop removes the LAST element of the array (weird!)
	
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
		greedyDivide(response.routes[0], numTravellers);//call the greedy algorithm here using the response.routes[0], which contains the waypoint_order field within the DirectionsResponse object (response?)
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