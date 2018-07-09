import React from 'react';
import axios from 'axios';
import './style.css';

var map, geocoder, infoWindow, previusMarker;
var markers = [];
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      lng: null,
      lag: null,
      radius: null,
      sessionId: this.props.sessionId,
      useLatLng: false,
      filter: "accountId IN ('77b0c1a5-6159-44a9-8268-07b393da0d4e')"
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
      this.setState({
        useLatLng: true
      });
      if (!this.state.lat) {
        alert('please locate yourself or enter a location first');
        return;
      }
      if (!this.state.radius || !(this.state.radius > 0)) {
        alert('please enter valid radius');
        return;
      }
      const response = await axios.post(
        'https://one-staging-api.brandify.com/service/location/search',
        this.state
      );
      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];
      this.drop(response.data.locations);

      //-------------everytime search set this lat and lng center of the map because returning data from
      //brandify is not accurate
      map.setCenter({ lat: 38.755975, lng: -97.46887 });
      map.setZoom(4);
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
          icon: image,
          address1: array,
          address2: location.address2,
          locationId: location.locationId
        });
        marker.addListener('click', self.toggleBounceAndInfoWindow);
        markers.push(marker);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  toggleBounceAndInfoWindow() {
    const address = this.address2
      ? (() => {
          var newArr = this.address1.slice();
          newArr.splice(1, 0, this.address2);
          return newArr.join(',');
        })()
      : this.address1.join(',');
    const content = `<div>Account Id:${
      this.locationId
    } <br />Address: ${address}</div>`;
    infoWindow.close();
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
      infoWindow.setContent(content);
      infoWindow.open(map, this);
    }
    previusMarker = previusMarker || this;
    if (previusMarker !== this) {
      previusMarker.setAnimation(null);
      previusMarker = this;
    }
  }
  drop(locations) {
    console.log('all locations', locations);
    var self = this;
    // map.setCenter({ lat: this.state.lat, lng: this.state.lng });
    // map.setZoom(4);
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
  async handleFire() {
    try {
      this.setState({
        useLatLng: false
      });
      const { data } = await axios.post(
        'https://one-staging-api.brandify.com/service/location/search',
        this.state
      );
      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];
      this.drop(data.locations);
      map.setCenter({ lat: 38.755975, lng: -97.46887 });
      map.setZoom(4);
    } catch (err) {
      console.log('err handleFire', err);
    }
  }
  handlefire() {}
  render() {
    return (
      <div>
        2 way to find locations
        <div id="map" />
        <div id="search">
          <div>
            <h2>Method One:</h2>
            Give me all the locations: <br />
            <br />
            <a className="button" onClick={() => this.handleFire()}>
              <span>FIRE</span>
            </a>
          </div>
          <br />
          <br />
          <hr />
          <div className="method">
            <h2>Method Two</h2>
            <span>Step 1:</span>
            <br />
            <a
              className="round-button"
              onClick={() => this.findCurrentLocation()}
            >
              locate yourself
            </a>
            <br />
            or
            <br />
            Enter a address
            <br />
            <input type="text" id="inputAddress" />
            <br />
            <a
              className="round-button"
              onClick={() =>
                this.codeAddress(document.getElementById('inputAddress').value)
              }
            >
              Find the location
            </a>
            {/* <a href="#" class="button">
            Already Taken? <i class="icon-chevron-right" />
          </a> */}
            <br />
            <br />
            <br />
            <span>Step 2:</span> <br />
            search radius:<br />
            <input
              type="text"
              onChange={e => this.setState({ radius: e.target.value })}
            />
            <br />
            <div className="wrap" onClick={() => this.handleSearch()}>
              <button className="btn">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
