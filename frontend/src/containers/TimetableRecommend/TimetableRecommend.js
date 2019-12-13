import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import TopBar from '../../components/TopBar/TopBar';
import RecommendConstraint from './RecommendConstraint/RecommendConstraint';
import RecommendResult from './RecommendResult/RecommendResult';
import RecommendTime from './RecommendTime/RecommendTime';
import RecommendCourse from './RecommendCourse/RecommendCourse';
import './TimetableRecommend.css';

class TimetableRecommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
    this.props.onGetLastPage();
  }

  handleLogout() {
    this.props.onLogout();
  }

  handleValid(value) {
    this.setState({ valid: value });
  }

  movePage(offset) {
    this.props.onPutLastPage(this.props.index + offset);
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }

    let content;
    switch (this.props.index) {
      case 0:
        content = (<RecommendConstraint handleValid={(value) => this.handleValid(value)} />);
        break;
      case 1:
        content = (<RecommendTime handleValid={(value) => this.handleValid(value)} />);
        break;
      case 2:
        content = (<RecommendCourse handleValid={(value) => this.handleValid(value)} />);
        break;
      case 3:
        content = (<RecommendResult timetable={[{ course: [] }, { course: [] }]} />);
        break;
      default:
        content = null;
        break;
    }

    const progressStatus = [];
    for (let i = 0; i < 4; i += 1) {
      if (i < this.props.index) {
        progressStatus.push('progress-past');
      } else if (i === this.props.index) {
        progressStatus.push('progress-working');
      } else progressStatus.push('progress-future');
    }

    return (
      <div className="TimetableRecommend d-flex flex-column">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="row flex-grow-1" style={{ minHeight: 0 }}>
          <div className="col-3 d-flex flex-column justify-content-center" id="recommend-progress">
            <table className="mx-auto">
              <tbody>
                <tr className={progressStatus[0]}>
                  <td><div className="oi oi-link-intact" /></td>
                  <td className="">{this.props.index === 0 ? '조건 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 0 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[1]}>
                  <td><div className="oi oi-clock" /></td>
                  <td className="">{this.props.index === 1 ? '시간 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 1 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[2]}>
                  <td><div className="oi oi-book" /></td>
                  <td className="">{this.props.index === 2 ? '과목 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 2 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[3]}>
                  <td><div className="oi oi-calendar" /></td>
                  <td className="">{this.props.index === 3 ? '결과 확인' : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-1 h-100 d-flex align-items-center">
            {this.props.index !== 0 && this.props.index !== 3
              ? (
                <button
                  type="button"
                  className="btn btn-simple mx-auto text-nowrap overflow-hidden"
                  id="recommend-back-button"
                  onClick={() => this.movePage(-1)}
                >
                  <h1 className="oi oi-chevron-left my-0" />
                  <br />
                    이전
                </button>
              )
              : null}
          </div>
          <div className="col-6 h-100 d-flex flex-column">
            <div className="recommend-content flex-grow-1" style={{ minHeight: 0 }}>
              {content}
            </div>
          </div>
          <div className="col-1 h-100 d-flex align-items-center">
            {this.props.index !== 3
              ? (
                <button
                  type="button"
                  className="btn btn-simple mx-auto text-nowrap overflow-hidden"
                  id="recommend-next-button"
                  disabled={!this.state.valid}
                  onClick={() => this.movePage(1)}
                >
                  <h1 className="oi oi-chevron-right my-0" />
                  <br />
                    다음
                </button>
              )
              : (
                <button
                  type="button"
                  className="btn btn-simple mx-auto text-nowrap overflow-hidden"
                  id="recommend-next-button"
                  disabled={!this.state.valid || this.props.timetable.length === 0}
                  onClick={() => {
                    this.movePage(-3);
                    this.props.onDeleteRecommend();
                  }}
                >
                  <h1 className="oi oi-chevron-right" />
                  <br />
                    처음으로
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

TimetableRecommend.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGetLastPage: PropTypes.func.isRequired,
  onPutLastPage: PropTypes.func.isRequired,
  onDeleteRecommend: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  timetable: PropTypes.arrayOf(PropTypes.shape({
    course: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      time: PropTypes.arrayOf(PropTypes.shape({
        week_day: PropTypes.number,
        start_time: PropTypes.number,
        end_time: PropTypes.number,
      })),
    })),
  })).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  constraints: state.user.constraints,
  changedCourses: state.user.changed_courses,
  index: state.user.lastPage,
  timetable: state.user.recommended_timetables,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetLastPage: () => dispatch(actionCreators.getLastPage()),
  onPutLastPage: (lastPage) => dispatch(actionCreators.putLastPage(lastPage)),
  onPutConstraints: (consts) => dispatch(actionCreators.putConstraints(consts)),
  onPutTimePref: (timePref) => dispatch(actionCreators.putTimePref(timePref)),
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
  onDeleteRecommend: () => dispatch(actionCreators.deleteRecommend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
