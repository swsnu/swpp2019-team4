import React from 'react';
import { NavLink } from 'react-router-dom';

const TopBar = (props) => (
  <div className="TopBar">
    <NavLink to="/main">
      <button id="assa-logo-button">ASSA</button>
    </NavLink>
    <NavLink to="">
      <button id="timetable-management-button">TIMETABLE</button>
    </NavLink>
    <NavLink to="">
      <button id="friend-button">FRIEND</button>
    </NavLink>
    <NavLink to="">
      <button id="personal-information-button">INFORMATION</button>
    </NavLink>
  </div>
);

export default TopBar;
