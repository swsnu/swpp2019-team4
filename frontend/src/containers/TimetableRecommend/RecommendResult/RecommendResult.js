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
      saving: false,
      saving_message: '',
      calculating: true,
    };
  }

  componentDidMount() {
    if (this.props.timetable.length === 0) {
      this.props.onGetRecommend();
    }
    this.intervalId = setInterval(() => this.loadTimetables(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  onClickSave() {
    this.setState({ saving: true, saving_message: '' });
    if (this.state.index >= 0) {
      const now = new Date();
      const string = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      this.props.onPostTimetable(`추천 시간표 ${this.state.index + 1} - ${string}`, '')
        .then((res) => {
          const timetableId = res.timetable.id;
          const courses = this.props.timetable[this.state.index].course;
          for (let i = 0; i < courses.length; i += 1) {
            this.props.onPostCourse(timetableId, courses[i].id);
          }
          this.setState({ saving: false, saving_message: '저장이 완료되었습니다.' });
        });
    }
  }

  loadTimetables() {
    if (this.props.timetable.length === 0) {
      this.props.onGetRecommend();
    }
  }

  changeview(index) {
    this.setState((prevState) => ({ ...prevState, index, saving_message: '' }));
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
    let numberOfCredits = 0;
    if (this.state.index >= 0) {
      this.props.timetable[this.state.index].course.forEach((course) => { numberOfCredits += course.credit; });
    }
    return (
      <div className="RecommendResult row h-100 overflow-hidden">
        <div className="recommended-result-list col-3 overflow-auto" style={{ height: 'calc(100% - 3rem)' }}>
          {tableviewlist}
        </div>
        <div className="timetable-result-space col-9 overflow-auto" style={{ height: 'calc(100% - 3rem)' }}>
          <div className="float-left mt-2 ml-2">
            <b>
              {this.state.index >= 0 && (`추천 시간표 ${this.state.index + 1} (${numberOfCredits}학점)`)}
              {' '}
            </b>
            {' '}
          </div>
          <div className="float-right d-flex">
            <div className="mr-2 mt-2">
              {this.state.saving_message}
            </div>
            <button
              type="button"
              className="btn btn-outline-dark mb-2"
              id="save-button"
              onClick={() => this.onClickSave()}
              disabled={this.state.index < 0 || this.state.saving}
            >
              시간표 저장
            </button>
          </div>
          <div className="timetable-result">
            <TimetableView
              id="timetable-resultview"
              height={22}
              courses={this.state.index >= 0 ? this.props.timetable[this.state.index].course : []}
              link={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

RecommendResult.defaultProps = {
  timetable: [],
};

RecommendResult.propTypes = {
  timetable: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({})),
  })),
  onGetRecommend: PropTypes.func.isRequired,
  onPostCourse: PropTypes.func.isRequired,
  onPostTimetable: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  timetable: state.user.recommended_timetables,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRecommend: () => dispatch(actionCreators.getRecommend()),
  onPostTimetable: (title, semester) => dispatch(actionCreators.postTimetable(title, semester)),
  onPostCourse: (tid, cid) => dispatch(actionCreators.postCourse(tid, cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendResult);
