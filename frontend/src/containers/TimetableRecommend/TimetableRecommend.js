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
      time_pref: [],
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

  handleTimePref(value) {
    this.setState({ time_pref: value });
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
          <div className="col-2 d-flex flex-column justify-content-center" id="recommend-progress">
            <table>
              <tbody>
                <tr className={progressStatus[0]}>
                  <td><div className="oi oi-link-intact" /></td>
                  <td className="small">{this.props.index === 0 ? '조건 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 0 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[1]}>
                  <td><div className="oi oi-clock" /></td>
                  <td className="small">{this.props.index === 1 ? '시간 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 1 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[2]}>
                  <td><div className="oi oi-book" /></td>
                  <td className="small">{this.props.index === 2 ? '과목 선택' : ''}</td>
                </tr>
                <tr className={this.props.index > 2 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[3]}>
                  <td><div className="oi oi-calendar" /></td>
                  <td className="small">{this.props.index === 3 ? '결과 확인' : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-10 h-100 d-flex flex-column">
            <div className="recommend-content flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
              {content}
            </div>
            <div className="pt-2 pb-4 d-flex justify-content-around">
              {this.props.index !== 0 && this.props.index !== 3
                ? (
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    id="recommend-back-button"
                    style={{ width: '100px' }}
                    onClick={() => this.movePage(-1)}
                  >
이전
                  </button>
                )
                : null}
              {this.props.index !== 3
                ? (
                  <button
                    type="button"
                    className="btn btn-dark"
                    id="recommend-next-button"
                    disabled={!this.state.valid}
                    style={{ width: '100px' }}
                    onClick={() => this.movePage(1)}
                  >
다음
                  </button>
                )
                : (
                  <button
                    type="button"
                    className="btn btn-dark"
                    id="recommend-next-button"
                    disabled={!this.state.valid || this.props.timetable.length === 0}
                    style={{ width: '300px' }}
                    onClick={() => {
                      this.movePage(-3);
                      this.props.onDeleteRecommend();
                    }}
                  >
처음부터 다시 추천받기
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TimetableRecommend.propTypes = {
  onGetUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  storedUser: PropTypes.shape({
    is_authenticated: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  storedUser: state.user.user,
  constraints: state.user.constraints,
  changedCourses: state.user.changed_courses,
  index: state.user.last_page,
  timetable: state.user.recommended_timetables
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onGetLastPage: () => dispatch(actionCreators.getLastPage()),
  onPutLastPage: (last_page) => dispatch(actionCreators.putLastPage(last_page)),
  onPutConstraints: (consts) => dispatch(actionCreators.putConstraints(consts)),
  onPutTimePref: (time_pref) => dispatch(actionCreators.putTimePref(time_pref)),
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
  onDeleteRecommend: () => dispatch(actionCreators.deleteRecommend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
