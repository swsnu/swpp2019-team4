import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
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

  toggleUncontrolledPopover() {
    this.setState((prevState) => ({ show_popover: !prevState.show_popover }));
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

    const progressLength = 4;
    const progressStatus = [];
    for (let i = 0; i < progressLength; i += 1) {
      if (i < this.props.index) {
        progressStatus.push('progress-past');
      } else if (i === this.props.index) {
        progressStatus.push('progress-working');
      } else progressStatus.push('progress-future');
    }

    const progressList = [];
    const symbolList = ['link-intact', 'clock', 'book', 'calendar'];
    const titleList = ['조건 선택', '시간 선택', '과목 선택', '결과 확인'];
    const detailList = ['이제 시작입니다', '시간을 선택하세요', '과목을 선택할까요', '결과를 확인하려면 500커밋 필요함'];
    for (let i = 0; i < progressLength; i += 1) {
      progressList.push(
        <tr className={progressStatus[i]}>
          <td><div className={`oi oi-${symbolList[i]}`} /></td>
          <td>{titleList[i]}</td>
          <td>
            {this.props.index === i
              && (
                <div>
                  <button id="popover" type="button">?</button>
                  <UncontrolledPopover placement="right" trigger="focus" target="popover">
                    <PopoverHeader>{titleList[i]}</PopoverHeader>
                    <PopoverBody>{detailList[i]}</PopoverBody>
                  </UncontrolledPopover>
                </div>
              )}
          </td>
        </tr>,
      );
      if (i !== progressLength - 1) {
        progressList.push(
          <tr className={this.props.index > i ? 'progress-past' : 'progress-future'}>
            <td><div className="bar" /></td>
          </tr>,
        );
      }
    }

    return (
      <div className="TimetableRecommend d-flex flex-column overflow-y-auto">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="row flex-grow-1" style={{ minHeight: 0 }}>
          <div className="col-3 d-flex flex-column justify-content-center" id="recommend-progress">
            <table className="mx-auto">
              <tbody>
                {progressList}
              </tbody>
            </table>
          </div>
          <div className="col-1 h-100 d-flex align-items-center">
            {this.props.index !== 0 && this.props.index !== progressLength - 1
              ? (
                <button
                  type="button"
                  className="btn btn-simple mx-auto text-nowrap overflow-hidden"
                  id="recommend-back-button"
                  onClick={() => this.movePage(-1)}
                >
                  <h1 className="oi oi-chevron-left my-0" />
                  <br />
                  <b>이전</b>
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
            {this.props.index !== progressLength - 1
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
                  <b>다음</b>
                </button>
              )
              : (
                <button
                  type="button"
                  className="btn btn-simple mx-auto text-nowrap overflow-hidden"
                  id="recommend-next-button"
                  disabled={!this.state.valid || this.props.timetable.length === 0}
                  onClick={() => {
                    this.movePage(-progressLength + 1);
                    this.props.onDeleteRecommend();
                  }}
                >
                  <h1 className="oi oi-chevron-right" />
                  <br />
                  <b>처음으로</b>
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
  onGetLastPage: PropTypes.func.isRequired,
  onPutLastPage: PropTypes.func.isRequired,
  onDeleteRecommend: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
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
  onPutCoursePref: (changedCourses) => dispatch(actionCreators.putCoursepref(changedCourses)),
  onDeleteRecommend: () => dispatch(actionCreators.deleteRecommend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
