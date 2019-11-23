import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class RecommendCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.handleValid(true);
  }

  render() {
    return (
      <div className="RecommendCourse" />
    );
  }
}

RecommendCourse.propTypes = {
  handleValid: PropTypes.func.isRequired,
};

export default connect(null, null)(RecommendCourse);
