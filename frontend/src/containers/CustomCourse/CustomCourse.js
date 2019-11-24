import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import * as actionCreators from '../../store/actions/index';
import './CustomCourse.css';

class CustomCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      time: '',
      color: '',
    };
  }

  post(title, color, time) {
    this.props.postCustomCourse({ title, color }, time);
  }

  render() {
    return (
      <div className="dim-layer">
        <div className="dimBg" />
        <div className="pop-layer">
          <div className="pop-head">
                    Post new course
          </div>
          <div className="pop-container">
            <div className="title-input">
              <label htmlFor="title">Title</label>
              <input
                className="title"
                value={this.state.title}
                onChange={(event) => { this.setState({ title: event.target.value }); }}
              />
            </div>
            <div className="time-input">
              <label htmlFor="time">Time</label>
              <input
                className="time"
                value={this.state.time}
                onChange={(event) => { this.setState({ time: event.target.value }); }}
              />
            </div>
            <div className="color-input">
              <label htmlFor="color">Color</label>
              <input
                className="color"
                value={this.state.color}
                onChange={(event) => { this.setState({ color: event.target.value }); }}
              />
            </div>
          </div>
          <div className="btn">
            <button type="button" className="close-button" onClick={() => this.props.closePopup()}>Close</button>
            <button
              type="button"
              className="post-button"
              onClick={() => this.post(this.state.title, this.state.color, this.state.time)}
            >
                Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

CustomCourse.propTypes = {
  postCustomCourse: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomCourse);
