import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TopBar.css';

const FrontBar = (props) => (
  <div className="FrontBar">
      <img src="/logo192.png" className="image-logo" />
  </div>
);

FrontBar.propTypes = {
};
export default FrontBar;
