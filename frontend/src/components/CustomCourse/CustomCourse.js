import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const CustomCourse = (props) => (
    <div className="popup">
        <label>
            <input className="title"></input>
        </label>
        <label>
            <input className="time"></input>
        </label>
        <label>
            <input className="color"></input>
        </label>
        <button onClick={() => props.closePopup()}>CLOSE</button>
    </div>
);

export default connect(null, null)(CustomCourse)