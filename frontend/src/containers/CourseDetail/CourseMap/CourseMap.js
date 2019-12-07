import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actionCreators from '../../../store/actions/index';
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
    this.state={
      building:{
        name:'',
        detail:'',
      }
    }
  }

  shouldComponentUpdate(nextProps) {    
    if(this.props.center.lat === nextProps.center.lat 
      && this.props.center.lng === nextProps.center.lng) {
      return true;
    }
    this.setState({building:nextProps.building})
    return true;
  }
  searchBuilding() {
    this.props.onSearchBuildings(this.state.building.name);
  }
  render() {
    const datalist = this.props.list.map((building) => 
      <option>{building.name}</option>
    )
    return (
      <div>
        <GoogleMapWrapper
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC2MiVSeJrRHzbm68f6ST_u37KTNFPH1JU&libraries=places"
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
              value={this.state.building.name}
              onChange={(event) => { this.setState({ building: {...this.state.building, name:event.target.value }}); }}
            /> 
        </div>
        <button onClick={() => {this.searchBuilding()}}>검색</button>
        <input
        value={this.state.building.detail}
        onChange={(event) => { this.setState({ building: {...this.state.building, detail:event.target.value }}); }}
        />
      </div>
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

const mapStateToProps = (state) => ({
  list: state.user.building_list
});

const mapDispatchToProps = (dispatch) => ({
  onSearchBuildings: (name) => dispatch(actionCreators.searchBuildings(name))
});
export default connect(mapStateToProps, mapDispatchToProps)(CourseMap);