var map, infoWindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {center: {lat: -34.397, lng: 150.644}, zoom: 6});
	infoWindow = new google.maps.InfoWindow;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

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
	document.getElementById("addrList").reset();
}

function addAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length;
	var iter = lastRow;
	var row = tbl.insertRow(lastRow);
	var cell = row.insertCell(0);
	var textNode = document.createTextNode(iter);
	cell.appendChild(textNode);
}

function remAddr() {
	var tbl = document.getElementById('addrList');
	var lastRow = tbl.rows.length;
	if (lastRow > 2) tbl.deleteRow(lastRow - 1);
}