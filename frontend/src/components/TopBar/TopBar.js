import React from 'react';
import { NavLink } from 'react-router-dom';
import './TopBar.css';

const TopBar = (props) => (
  <div className="TopBar">
    <div className="TopLeftBar">
      <a href="/main">ASSA</a>
      <a href="/manage">TIMETABLE</a>
    </div>
    <div className="Profile">
      <NavLink to="/setting">
        <button type="button" id="personal-information-button">INFORMATION</button>
      </NavLink>
      <button type="button" id="logout-button" onClick={() => props.logout()}>LOGOUT</button>
    </div>
  </div>
);

export default TopBar;
