import React from 'react';
import './style.css';
var map, infoWindow, geocoder;
class Map extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 8,
      center: latlng
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    infoWindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
  }

  findCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('you are here');
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(15);
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
  render() {
    return (
      <div>
        <div id="map" />
        <button onClick={() => this.findCurrentLocation()}>
          locate myself
        </button>
      </div>
    );
  }
}

export default Map;
