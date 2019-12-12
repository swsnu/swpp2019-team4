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
      isSearchBuilding: false,
      isSearchFail: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.auto !== nextProps.auto && nextProps.auto) {
      this.setState({ isSearchBuilding: false });
      this.updateCenter(nextProps.list[0].name, nextProps.list);
      return true;
    }
    if (nextProps.auto) {
      this.props.autoComplete();
      return true;
    }
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
    if (this.props.building.name === '') {
      return;
    }
    this.props.onSearchBuildings(this.props.building.name);
    this.setState({ isSearchBuilding: true });
  }

  updateCenter(name, list) {
    const center = list.filter((building) => building.name === name);
    this.setState({ isSearchBuilding: false });
    if (center.length > 0 && !(this.props.building.lat === center[0].lat && this.props.building.lng === center[0].lng)) {
      this.props.set({
        ...this.props.building, name, lat: center[0].lat, lng: center[0].lng,
      });
    }
  }

  reset() {
    this.props.set(this.props.origin);
    this.setState({ isSearchBuilding: false });
  }

  render() {
    const building_list = this.props.list.map((building) => <button type="button" id={building.name} key={building.name} onClick={() => this.updateCenter(building.name, this.props.list)}>{building.name}</button>);
    const editBuilding = (
      <div>
        <div>
          <input
            value={this.props.building ? this.props.building.name : ''}
            onChange={(event) => { this.props.set({ ...this.props.building, name: event.target.value, detail: this.props.building.detail }); }}
          />
        </div>
        <div>{this.props.list.length === 0 && this.state.isSearchBuilding ? '건물을못찾았습니다' : ''}</div>
        <button type="button" onClick={() => { this.searchBuilding(); }}>검색</button>
        <button type="button" onClick={() => { this.reset(); }}>원래위치로</button>
        <div>
          {this.state.isSearchBuilding ? building_list : null}
          <input
            value={this.props.building ? this.props.building.detail : ''}
            onChange={(event) => { this.props.set({ ...this.props.building, detail: event.target.value, name: this.props.building.name }); }}
          />
        </div>
      </div>
    );
    return (
      <div>
        {this.props.editable ? null : `${this.props.building.name} ${this.props.building.detail}`}
        {!(this.props.building.lat !== undefined && this.props.building.lng !== undefined) ? null
          : (
            <div>
              <GoogleMapWrapper
                googleMapURL={'https://maps.googleapis.com/maps/api/js?'
            + 'key=AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places'}
                loadingElement={<div style={{ height: '20rem' }} />}
                containerElement={<div style={{ height: '20rem' }} />}
                mapElement={<div style={{ height: '20rem' }} />}
                center={this.props.center}
              />
              {this.props.editable ? editBuilding : null}
            </div>
          )}
      </div>
    );
  }
}

CourseMap.defaultProps = {
  center: { lat: 0, lng: 0 },
  building: {
    name: '', detail: '', lat: 0, lng: 0,
  },
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
  auto: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  list: state.user.building_list,
  auto: state.user.search_auto_complete,
});

const mapDispatchToProps = (dispatch) => ({
  onSearchBuildings: (name) => dispatch(actionCreators.searchBuildings(name)),
  autoComplete: () => dispatch(actionCreators.autoComplete()),
});
export default connect(mapStateToProps, mapDispatchToProps)(CourseMap);
