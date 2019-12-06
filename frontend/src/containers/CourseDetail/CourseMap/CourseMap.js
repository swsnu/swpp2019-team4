import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';

const GoogleMapWrapper = withScriptjs(withGoogleMap((props) => 
  <GoogleMap
    defaultZoom={17}
    center={props.center}
  >
    <Marker
      position={props.center}
    />
  </GoogleMap>
));

class CourseMap extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.center.lat === nextProps.center.lat 
      && this.props.center.lng === nextProps.center.lng) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <GoogleMapWrapper
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places"
        loadingElement={<div style={{ height: '20rem' }} />}
        containerElement={<div style={{ height: '20rem' }} />}
        mapElement={<div style={{ height: '20rem' }} />}
        center={this.props.center}
      />
    );
  }
}

CourseMap.defaultProps = {
  center: {lat: 0, lng: 0},
}

CourseMap.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
}

export default CourseMap;