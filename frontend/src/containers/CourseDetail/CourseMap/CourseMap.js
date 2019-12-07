import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';
import * as actionCreators from '../../../store/actions/index';

const GoogleMapWrapper = withScriptjs(withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={17}
    center={props.center}
  >
    <Marker
      position={props.center}
    />
  </GoogleMap>
)));

class CourseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.building !== nextProps.building) {
      return true;
    }
    if (this.props.center && this.props.center.lat === nextProps.center.lat
      && this.props.center.lng === nextProps.center.lng) {
      return true;
    }
    return true;
  }

  searchBuilding() {
    this.props.onSearchBuildings(this.props.building.name);
  }

  render() {
    const datalist = this.props.list.map((building) => <option key={building.name}>{building.name}</option>);
    return (
      <div>
        <GoogleMapWrapper
          googleMapURL={'https://maps.googleapis.com/maps/api/js?'
          + 'key=AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places'}
          loadingElement={<div style={{ height: '20rem' }} />}
          containerElement={<div style={{ height: '20rem' }} />}
          mapElement={<div style={{ height: '20rem' }} />}
          center={this.props.center}
        />
        <div>
          <datalist id="suggestions">
            {datalist}
          </datalist>
          <input
            autoComplete="on"
            list="suggestions"
            value={this.props.building ? this.props.building.name : ''}
            onChange={(event) => { this.props.set({ name: event.target.value, detail: this.props.building.detail }); }}
          />
        </div>
        <button type="button" onClick={() => { this.searchBuilding(); }}>검색</button>
        <input
          value={this.props.building ? this.props.building.detail : ''}
          onChange={(event) => { this.props.set({ detail: event.target.value, name: this.props.building.name }); }}
        />
      </div>
    );
  }
}

CourseMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  building: { name: '', detail: '' },
};

CourseMap.propTypes = {
  building: PropTypes.shape({
    name: PropTypes.string,
    detail: PropTypes.string,
  }),
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  list: PropTypes.shape({
    map: PropTypes.func,
  }).isRequired,
  set: PropTypes.func.isRequired,
  onSearchBuildings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  list: state.user.building_list,
});

const mapDispatchToProps = (dispatch) => ({
  onSearchBuildings: (name) => dispatch(actionCreators.searchBuildings(name)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CourseMap);
