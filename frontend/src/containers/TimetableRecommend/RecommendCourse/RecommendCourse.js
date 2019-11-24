import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './RecommendCourse.css';

class RecommendCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
  }

  componentDidMount() {
    this.props.handleValid(true);
  }

  render() {
    return (
      <div className="RecommendCourse">
        <div className="col-6 offset-3">
          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active w-100"
                data-toggle="tab"
                href="#rated-tab"
                role="tab"
                aria-controls="rated"
                aria-selected="true"
              >
평가
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link w-100"
                data-toggle="tab"
                href="#unrated-tab"
                role="tab"
                aria-controls="unrated"
                aria-selected="false"
              >
미평가
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link w-100"
                data-toggle="tab"
                href="#exception-tab"
                role="tab"
                aria-controls="exception"
                aria-selected="false"
              >
예외
              </a>
            </li>
          </ul>
          <div className="input-group mt-2">
            <div className="input-group-prepend">
              <button className="form-control" type="button" id="recommend-search-filter">
                <div className="oi oi-target" />
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              id="recommend-search-name"
              placeholder="과목명"
              value={this.state.input}
              onChange={(event) => this.setState({ input: event.target.value })}
            />
            <div className="input-group-append">
              <button className="btn btn-dark" type="button" id="recommend-search-button">
                <div className="oi oi-magnifying-glass" />
              </button>
            </div>
          </div>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane show active" id="rated-tab" role="tabpanel" aria-labelledby="rated-tab">
              평가된 과목
            </div>
            <div className="tab-pane" id="unrated-tab" role="tabpanel" aria-labelledby="unrated-tab">
              평가되지 않은 과목
            </div>
            <div className="tab-pane" id="exception-tab" role="tabpanel" aria-labelledby="exception-tab">
              이미 수강한 과목
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecommendCourse.propTypes = {
  handleValid: PropTypes.func.isRequired,
};

export default connect(null, null)(RecommendCourse);
