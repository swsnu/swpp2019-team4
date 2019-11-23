import React, { Component } from 'react';
import { connect } from 'react-redux';

class RecommendTime extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="RecommendTime">
        <h1>Time Page</h1>
      </div>
    );
  }
}

RecommendTime.propTypes = {
};

export default connect(null, null)(RecommendTime);
