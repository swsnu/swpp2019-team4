import React from 'react';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => (
  <div className="TopBar" style={{ width: '100%' }}>
    <NavLink to="/main">
      <button type="button" id="assa-logo-button" style={{ width: '25%' }}>ASSA</button>
    </NavLink>
    <NavLink to="/manage">
      <button type="button" id="timetable-management-button" style={{ width: '25%' }}>TIMETABLE</button>
    </NavLink>
    <NavLink to="/friend">
      <button type="button" id="friend-button" style={{ width: '25%' }}>FRIEND</button>
    </NavLink>
    <NavLink to="/setting">
      <button type="button" id="personal-information-button" style={{ width: '25%' }}>INFORMATION</button>
    </NavLink>
  </div>
);

export default TopBar;
