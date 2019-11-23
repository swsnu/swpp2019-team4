import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './CustomCourse.css'

const CustomCourse = (props, object, title, time, color) => (
    <div class="dim-layer">
        <div class="dimBg"></div>
        <div class="pop-layer">
            <div class="pop-head">
                Post new course
            </div>
            <div class="pop-container">
                <div class="title-input">
                    <label htmlFor="title">Title</label>
                    <input className="title" value={title} onChange={(event) => {title=event.target.value}}/>
                </div>
                <div class="time-input">
                    <label htmlFor="time">Time</label>
                    <input className="time" value={time} onChange={(event) => {time=event.target.value}}/>
                </div>
                <div class="color-input">
                    <label htmlFor="color">Color</label>
                    <input className="color" value={color} onChange={(event) => {color=event.target.value}}/>
                </div>
            </div>
            <div class="btn">
                <button class="close-button" onClick={() => props.closePopup()}>Close</button>
                <button class="post-button" onClick={() => props.postCustomCourse({title: title, color: color}, time)}>Submit</button>
            </div>
        </div>
    </div>
);

export default connect(null, null)(CustomCourse)