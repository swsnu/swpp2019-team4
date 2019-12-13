import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actionCreators from '../../../store/actions/index';
import TimetableView from '../../../components/TimetableView/TimetableView';

class RecommendChoice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onGetTimetables();
    this.props.onGetRecommendBase()
      .then(() => this.props.onGetTimetable(this.props.recommend_base))
      .catch(() => {});
  }

  setBase(timetable_id) {
    this.props.onPutRecommendBase(timetable_id);
    this.props.onGetTimetable(timetable_id);
  }

  render() {
    const timetableList = this.props.timetables
      .map((item, index) => ( 
          <button
            type="button"
            className="dropdown-item"
            key={index}
            onClick = {() => this.setBase(item.id)}
          >
            {item.title}
          </button>
        ));
    timetableList.push(<hr/>)
    timetableList.push(
        <button
          type="button"
          className="dropdown-item"
          onClick = {() => this.setBase(-1)}
        >
          새로운 시간표
        </button>
    )

    const timetable = this.props.timetables.find((item) => item.id === this.props.recommend_base);
    const courses = (timetable === undefined) ? [] : timetable.course;
    return (
      <div className="RecommendChoice">
        <div className="dropdown d-flex flex-row align-items-center justify-content-center">
          <button
            className="btn btn-like-form"
            type="button"
            id="semester-select"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <b>{timetable === undefined ? '새로운 시간표' : timetable.title}</b>
            <div className="oi oi-chevron-bottom pl-2" />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdown-timetable-base">
            {timetableList}
          </div>
          <div>{'에서 시작하기'}</div>
        </div>
        <TimetableView
          courses={courses}
          height={24}
          link={true}
        />
      </div>
    );
  }
}

RecommendChoice.propTypes = {
};

const mapStateToProps = (state) => ({
  timetables: state.user.timetables,
  recommend_base: state.user.recommend_base_timetable,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRecommendBase: () => dispatch(actionCreators.getRecommendBase()),
  onPutRecommendBase: (timetable_id) => dispatch(actionCreators.putRecommendBase(timetable_id)),
  onGetTimetable: (timetable_id) => dispatch(actionCreators.getTimetable(timetable_id)),
  onGetTimetables: () => dispatch(actionCreators.getTimetables()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendChoice);