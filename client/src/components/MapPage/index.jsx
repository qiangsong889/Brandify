import React from 'react';
import axios from 'axios';
import './style.css';

var map, infoWindow, geocoder;
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      lng: null,
      lag: null,
      radius: null
    };
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

  codeAddress(address) {
    var self = this;
    geocoder.geocode({ address: address }, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        self.setState({
          lng: results[0].geometry.location.lat(),
          lat: results[0].geometry.location.lat()
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  findCurrentLocation() {
    var self = this;
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

          self.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
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
  async handleSearch() {
    try {
      const payload = {
        radius: this.state.radius,
        useLatLng: true,
        filter: "accountId IN ('77b0c1a5-6159-44a9-8268-07b393da0d4e')",
        lat: this.state.lat,
        lng: this.state.lng,
        sessionId: this.props.sessionId
      };
      console.log('payload', payload);
      const response = await axios.post(
        'https://one-staging-api.brandify.com/service/location/search',
        payload
      );
      this.drop(response.data.locations);
    } catch (err) {
      console.log('err sending axios request', err);
    }
  }
  handleInputAddress(address) {}
  //*************************************************************************
  //              ---drop locations marker with animation---

  mapLocationOnMap(location) {
    var array = [];
    array.push(
      location.address1,
      location.city,
      location.state,
      location.postalCode
    );
    var self = this;
    var image = 'https://furtaev.ru/preview/liked_place_map_pointer_small.png';
    var marker;
    geocoder.geocode({ address: array.join(',') }, function(results, status) {
      if (status == 'OK') {
        marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location,
          icon: image
        });
        marker.addListener('click', self.toggleBounce);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  toggleBounce() {
    console.log(this);
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  drop(locations) {
    console.log('all locations', locations);
    var self = this;
    map.setCenter({ lat: this.state.lat, lng: this.state.lng });
    map.setZoom(4);
    function setDelay(location, i) {
      setTimeout(function() {
        self.mapLocationOnMap(location);
      }, i * 200);
    }
    for (var i = 0; i < 13; i++) {
      setDelay(locations[i], i);
    }
  }
  //*************************************************************************
  render() {
    return (
      <div>
        <div id="map" />
        <button onClick={() => this.findCurrentLocation()}>
          locate myself
        </button>
        <br />
        or
        <br />
        enter your address
        <input type="text" id="inputAddress" />
        <button
          onClick={() =>
            this.codeAddress(document.getElementById('inputAddress').value)
          }
        >
          submit
        </button>
        {this.state.lng && (
          <div>
            lng:{this.state.lng}, lat:{this.state.lat}
          </div>
        )}
        <br />
        search radius:{' '}
        <input
          type="text"
          onChange={e => this.setState({ radius: e.target.value })}
        />
        <input type="submit" onClick={() => this.handleSearch()} />
      </div>
    );
  }
}

export default Map;
