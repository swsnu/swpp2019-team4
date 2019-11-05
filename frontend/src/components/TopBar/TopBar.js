import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TopBar.css';

const TopBar = (props) => (
  <div className="TopBar">
    <div className="TopLeftBar">
      <NavLink id="assa-logo-button" to="/main">ASSA</NavLink>
      <NavLink id="timetable-management-button" to="/manage">TIMETABLE</NavLink>
    </div>
    <div className="Profile">
      <NavLink to="/setting">
        <button type="button" id="personal-information-button">INFORMATION</button>
      </NavLink>
      <button type="button" id="logout-button" onClick={() => props.logout()}>LOGOUT</button>
    </div>
  </div>
);

TopBar.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default TopBar;
