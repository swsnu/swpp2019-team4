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
      index: -1,
      calculating: true,
    };
  }

  componentDidMount() {
    if (this.props.timetable.length === 0) {
      this.props.onGetRecommend()
        .then((res) => {
          if (res.timetables.length === 0) {
            this.props.onPostRecommend();
          }
        });
    }
  }

  changeview(index) {
    this.setState((prevState) => ({ ...prevState, index }));
  }

  onClickSave() {
    if (this.state.index >= 0) {
      this.props.onPostTimetable(`추천 시간표 ${this.state.index + 1}`, '')
        .then((res) => {
          const timetable_id = res.timetable.id;
          const courses = this.props.timetable[this.state.index].course;
          for (let i = 0; i < courses.length; i += 1) {
            this.props.onPostCourse(timetable_id, courses[i].id);
          }
        });
    }
  }

  render() {
    if (this.props.timetable.length === 0) {
      return (
        <div className="RecommendResult loading d-flex align-items-center w-100 h-100">
          <h1>계산하는 중입니다...</h1>
        </div>
      );
    }
    const tableviewlist = [];
    for (let i = 0; i < this.props.timetable.length; i += 1) {
      tableviewlist.push(
        <div
          key={i}
          className="recommended-timetable-space"
          role="button"
          tabIndex={0}
          onClick={() => this.changeview(i)}
          onKeyDown={() => this.changeview(i)}
        >
          <h1 className="timetable-one-index"><b>{i + 1}</b></h1>
          <TimetableView
            id="timetable-one-result"
            height={6}
            courses={this.props.timetable[i].course}
            text={false}
            link={false}
          />
        </div>,
      );
    }
    return (
      <div className="RecommendResult row h-100 overflow-hidden">
        <div className="recommended-result-list col-3 overflow-auto" style={{ height: 'calc(100% - 3rem)' }}>
          {tableviewlist}
        </div>
        <div className="timetable-result-space col-9 overflow-auto" style={{ height: 'calc(100% - 3rem)' }}>
          <div className="float-left mt-2 ml-2">
            <b>
              {this.state.index >= 0 && (`추천 시간표 ${this.state.index + 1}`)}
              {' '}
            </b>
            {' '}
          </div>
          <button type="button" className="btn btn-outline-dark float-right mb-2" id="save-button" onClick={() => this.onClickSave()} disabled={this.state.index < 0}>시간표 저장</button>
          <div className="timetable-result">
            <TimetableView
              id="timetable-resultview"
              height={24}
              courses={this.state.index >= 0 ? this.props.timetable[this.state.index].course : []}
              link={false}
            />
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

const mapStateToProps = (state) => ({
  timetable: state.user.recommended_timetables,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRecommend: () => dispatch(actionCreators.getRecommend()),
  onPostRecommend: () => dispatch(actionCreators.postRecommend()),
  onPostTimetable: (title, semester) => dispatch(actionCreators.postTimetable(title, semester)),
  onPostCourse: (tid, cid) => dispatch(actionCreators.postCourse(tid, cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendResult);
