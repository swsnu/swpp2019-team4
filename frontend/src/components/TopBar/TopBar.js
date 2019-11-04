import React from 'react';
import { NavLink } from 'react-router-dom';

const TopBar = () => (
  <div className="TopBar">
    <NavLink to="/main">
      <button type="button" id="assa-logo-button">ASSA</button>
    </NavLink>
    <NavLink to="">
      <button type="button" id="timetable-management-button">TIMETABLE</button>
    </NavLink>
    <NavLink to="">
      <button type="button" id="friend-button">FRIEND</button>
    </NavLink>
    <NavLink to="">
      <button type="button" id="personal-information-button">INFORMATION</button>
    </NavLink>
  </div>
);

export default TopBar;
