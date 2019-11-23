import React, { Component } from 'react';
import { connect } from 'react-redux';

class RecommendCourse extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="RecommendCourse">
        <h1>Course Page</h1>
      </div>
    );
  }
}

RecommendCourse.propTypes = {
};

export default connect(null, null)(RecommendCourse);
