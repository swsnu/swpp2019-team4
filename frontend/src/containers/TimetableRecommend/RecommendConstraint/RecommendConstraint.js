import React, { Component } from 'react';
import { connect } from 'react-redux';

class RecommendConstraint extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="RecommendConstraint">
        <h1>Constraint Page</h1>
      </div>
    );
  }
}

RecommendConstraint.propTypes = {
};

export default connect(null, null)(RecommendConstraint);
