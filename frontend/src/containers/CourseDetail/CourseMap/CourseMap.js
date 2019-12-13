import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  withScriptjs, withGoogleMap, GoogleMap, Marker,
} from 'react-google-maps';
import * as actionCreators from '../../../store/actions/index';
import './CourseMap.css';

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
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.auto !== nextProps.auto && nextProps.auto) {
      this.setState({ isSearchBuilding: false });
      this.updateCenter(nextProps.list[0].name, nextProps.list);
    } else if (nextProps.auto) {
      this.props.autoComplete();
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
    if (center.length > 0
      && !(this.props.building.lat === center[0].lat && this.props.building.lng === center[0].lng)) {
      this.props.onChange({
        ...this.props.building, name, lat: center[0].lat, lng: center[0].lng,
      });
    }
  }

  enterKey(event) {
    if (event.keyCode === 13) {
      this.searchBuilding();
    }
  }

  render() {
    const buildingList = this.props.list.map((building, index) => (
      <div key={index}>
        <div className="d-flex flex-row w-100 align-items-center justify-content-between">
          <div>
            {building.name}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            id={building.name}
            key={building.name}
            onClick={() => this.updateCenter(building.name, this.props.list)}
          >
            선택
          </button>
        </div>
        <hr className="my-1" />
      </div>
    ));
    const editBuilding = (
      <div>
        <div className="row my-2 mx-1">
          <div className="col-7 d-flex flex-row px-1">
            <input
              className="form-control form-control-sm flex-grow-1"
              style={{width: "0"}}
              placeholder="건물"
              value={this.props.building ? this.props.building.name : ''}
              onKeyDown={(event) => this.enterKey(event)}
              onChange={(event) => {
                this.props.onChange({
                  ...this.props.building,
                  name: event.target.value,
                  detail: this.props.building.detail,
                });
              }}
            />
            <button
              type="button"
              className="btn btn-dark btn-sm"
              style={{ minWidth: '4rem' }}
              onClick={() => { this.searchBuilding(); }}
            >
              {'검색'}
            </button>
          </div>
          <div className="col-5 px-1">
            <input
              className="form-control form-control-sm"
              placeholder="세부 장소"
              value={this.props.building ? this.props.building.detail : ''}
              onChange={(event) => {
                this.props.onChange({
                  ...this.props.building,
                  detail: event.target.value,
                  name: this.props.building.name,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
    return (
      <div className="CourseMap">
        {!(this.props.building.lat !== undefined && this.props.building.lng !== undefined)
          ? (
            <div id="map-alt" style={this.props.style}>
              <div id="map-alt-text"> 장소를 선택하세요. </div>
            </div>
          )
          : (
            <div>
              <GoogleMapWrapper
                googleMapURL={'https://maps.googleapis.com/maps/api/js?'
            + 'key=AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places'}
                loadingElement={<div style={this.props.style} />}
                containerElement={<div style={this.props.style} />}
                mapElement={<div style={this.props.style} />}
                center={{ lat: 1 * this.props.building.lat, lng: 1 * this.props.building.lng }}
              />
              {this.props.editable ? editBuilding : null}
              <div>{this.props.list.length === 0 && this.state.isSearchBuilding ? '건물을 찾지 못했습니다.' : ''}</div>
              <div className="overflow-auto" style={{ maxHeight: '10rem' }}>
                {this.state.isSearchBuilding ? buildingList : null}
              </div>
            </div>
          )}
      </div>
    );
  }
}

CourseMap.defaultProps = {
  building: {
    name: '', detail: '', lat: '0', lng: '0',
  },
  style: {},
  editable: false,
  onChange: () => {},
};

CourseMap.propTypes = {
  style: PropTypes.shape({}),
  building: PropTypes.shape({
    name: PropTypes.string,
    detail: PropTypes.string,
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  onSearchBuildings: PropTypes.func.isRequired,
  auto: PropTypes.bool.isRequired,
  autoComplete: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  editable: PropTypes.bool,
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
