import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './CustomCourse.css';

const CustomCourse = (props, object, title, time, color) => (
  <div className="dim-layer">
    <div className="dimBg" />
    <div className="pop-layer">
      <div className="pop-head">
                Post new course
      </div>
      <div className="pop-container">
        <div className="title-input">
          <label htmlFor="title">Title</label>
          <input className="title" value={title} onChange={(event) => { title = event.target.value; }} />
        </div>
        <div className="time-input">
          <label htmlFor="time">Time</label>
          <input className="time" value={time} onChange={(event) => { time = event.target.value; }} />
        </div>
        <div className="color-input">
          <label htmlFor="color">Color</label>
          <input className="color" value={color} onChange={(event) => { color = event.target.value; }} />
        </div>
      </div>
      <div className="btn">
        <button className="close-button" onClick={() => props.closePopup()}>Close</button>
        <button className="post-button" onClick={() => props.postCustomCourse({ title, color }, time)}>Submit</button>
      </div>
    </div>
  </div>
);

export default connect(null, null)(CustomCourse);
