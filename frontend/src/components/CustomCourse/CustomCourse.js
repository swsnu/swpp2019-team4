import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const CustomCourse = (props, object, title, time, color) => (
    <div className="popup">
        <label htmlFor="title">Title</label>
            <input className="title" value={title} onChange={(event) => {title=event.target.value}}/>
        <label htmlFor="time">Time</label>
            <input className="time" value={time} onChange={(event) => {time=event.target.value}}/>
        <label htmlFor="color">Color</label>
            <input className="color" value={color} onChange={(event) => {color=event.target.value}}/>
        <button onClick={() => props.closePopup()}>Close</button>
        <button onClick={() => props.postCustomCourse({title: title, color: color}, time)}>Submit</button>
    </div>
);

export default connect(null, null)(CustomCourse)