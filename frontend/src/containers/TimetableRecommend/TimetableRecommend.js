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
      index: 0,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogout() {
    this.props.onLogout();
  }

  handleValid(value) {
    this.setState({ valid: value });
  }

  movePage(offset) {
    if (this.state.index == 2) {
      this.props.onPutCoursePref(this.props.changedCourses);
    }
    this.setState((prevState) => ({ ...prevState, index: prevState.index + offset }));
    
  }

  render() {
    if (this.props.storedUser.is_authenticated === false) {
      return (
        <Redirect to="/login" />
      );
    }

    let content;
    switch (this.state.index) {
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
      if (i < this.state.index) {
        progressStatus.push('progress-past');
      } else if (i === this.state.index) {
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
                  <td className="small">{this.state.index === 0 ? '조건 선택' : ''}</td>
                </tr>
                <tr className={this.state.index > 0 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[1]}>
                  <td><div className="oi oi-clock" /></td>
                  <td className="small">{this.state.index === 1 ? '시간 선택' : ''}</td>
                </tr>
                <tr className={this.state.index > 1 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[2]}>
                  <td><div className="oi oi-book" /></td>
                  <td className="small">{this.state.index === 2 ? '과목 선택' : ''}</td>
                </tr>
                <tr className={this.state.index > 2 ? 'progress-past' : 'progress-future'}>
                  <td><div className="bar" /></td>
                  <td />
                </tr>
                <tr className={progressStatus[3]}>
                  <td><div className="oi oi-calendar" /></td>
                  <td className="small">{this.state.index === 3 ? '결과 확인' : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-10 h-100 d-flex flex-column">
            <div className="recommend-content flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
              {content}
            </div>
            <div className="pt-2 pb-4 d-flex justify-content-around">
              {this.state.index !== 0
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
              {this.state.index !== 3
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
                : null}
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
  changedCourses: state.user.changed_courses,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
