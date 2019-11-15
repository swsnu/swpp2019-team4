import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TopBar.css';

const TopBar = (props) => (
  <div className="TopBar">
    <nav className="navbar">
      <NavLink className="navbar-brand except" id="assa-logo-button" to="/main">
        <img className="" src="/logo192.png" alt="logo" id="assa-logo" />
      </NavLink>
      <div className="mr-auto">
        <NavLink id="main-button" to="/main">OVERVIEW</NavLink>
        <NavLink id="timetable-management-button" to="/manage">TIMETABLE</NavLink>
        <NavLink id="timetable-recommendation-button" to="/recommend">RECOMMENDATION</NavLink>
        <NavLink id="friend-management-button" to="/setting">FRIEND</NavLink>
      </div>
      <div>
        <NavLink id="personal-information-button" to="/setting">ACCOUNT</NavLink>
        <button type="button" className="text-black-50" id="logout-button" onClick={() => props.logout()}>
          LOGOUT
        </button>
      </div>
    </nav>
  </div>
);

TopBar.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default TopBar;
