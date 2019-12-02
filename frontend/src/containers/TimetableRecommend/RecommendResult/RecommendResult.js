import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actionCreators from '../../../store/actions/index';
import TimetableView from '../../../components/TimetableView/TimetableView';
import './RecommendResult.css';

class RecommendResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  changeview(newcourses) {
    this.setState((prevState) => ({ ...prevState, courses: newcourses }));
  }

  render() {
    const tableviewlist = [];
    for (let i = 0; i < this.props.timetable.length; i += 1) {
      tableviewlist.push(
        <div
          key={i}
          className="recommended-timetable-space"
          role="button"
          tabIndex={0}
          onClick={() => this.changeview(this.props.timetable[i].course)}
          onKeyDown={() => this.changeview(this.props.timetable[i].course)}
        >
          <TimetableView
            id="timetable-one-result"
            height={4}
            courses={this.props.timetable[i].course}
            text={false}
            link={false}
            title=""
          />
        </div>,
      );
    }
    return (
      <div className="RecommendResult row">
        <div className="recommended-result-list col-3">
          {tableviewlist}
        </div>
        <div className="timetable-result-space col-9">
          <div className="timetable-result">
            <TimetableView
              id="timetable-resultview"
              height={24}
              courses={this.state.courses}
              text
              link={false}
              title=""
            />
          </div>
          <div className="buttons">
            <div className="save-space">
              <button type="button" id="save-button" style={{ width: '100%' }}>SAVE</button>
            </div>
            <div className="close-space">
              <button
                type="button"
                id="close-button"
                style={{ width: '100%' }}
              >
CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecommendResult.propTypes = {
  timetable: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onGetRecommend: () => dispatch(actionCreators.getRecommend()),
});

export default connect(null, mapDispatchToProps)(RecommendResult);
