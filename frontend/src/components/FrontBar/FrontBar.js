import React from 'react';
import { NavLink } from 'react-router-dom';
import './FrontBar.css';

const FrontBar = () => (
  <div className="FrontBar pt-1">
    {/* <h2 className="oi oi-chevron-left text-dark m-0" id="prev-logo" /> */}
    <NavLink to="/login">
      <img className="" src="/logo192.png" alt="logo" id="assa-logo" />
    </NavLink>
  </div>
);

export default FrontBar;
