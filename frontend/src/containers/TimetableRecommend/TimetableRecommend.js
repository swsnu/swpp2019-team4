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
  const detailList = [(<div>{'추천 받을 시간표가 만족할 조건을 입력합니다.'}<br/><br/><b>{'주 N일제: '}</b>{'1주일에 수업이 있는 날 수가 N일 이하인 시간표만 추천합니다.'}<br/><br/><b>{'총 학점 범위: '}</b>{'시간표에 들어있는 과목들의 학점 수의 총합이 범위 안에 있는 시간표만 추천합니다.'}<br/><br/><b>{'전공 학점 범위: '}</b>{'시간표에 들어있는 전공 과목의 학점 수의 총합이 범위 안에 있는 시간표만 추천합니다.'}</div>),
  (<div>{'시간의 선호도를 표에 색칠하여 입력합니다.'}<br/><br/>{'각각의 시간이 좋으면 하얀색, 싫으면 빨간색으로 칠하면 됩니다.'}<br/><br/>{'오른쪽의 색깔 동그라미를 눌러서 색을 선택한 후, 표의 칸을 누르면 색칠됩니다.'}<br/><br/>{'좋은 평가를 내릴수록 추천 시간표에 해당 시간대의 과목이 들어갈 확률이 높아집니다.'}</div>), 
  (<div>{'시간표에 넣을 과목을 선택하고 평가합니다.'}<br/><br/>{'과목마다 있는 슬라이드바를 움직여서,'}<b>{'이 과목을 시간표에 넣고 싶은 정도'}</b>{'를 평가합니다.'}<br/><br/>{'"평가" 탭에서는 지금까지 평가한 과목, "미평가" 탭에서는 아직 평가하지 않은 과목을 보여줍니다.'}<br/><br/><b>{'추천 시간표에는 평가한 과목만 포함됩니다.'}</b>{' 즉, 평가하지 않은 과목은 추천 시간표에 들어가지 않습니다.'}</div>), 
  (<div>{'추천된 시간표를 조회합니다.'}<br/><br/>{'시간표 저장 버튼을 누르면 내 시간표에 선택한 추천 시간표가 저장됩니다.'}<br/><br/>{'높게 평가했던 과목일수록 초록색, 낮게 평가했던 과목일수록 빨간색에 가까운 색으로 보여 줍니다.'}</div>)];
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
  onDeleteRecommend: () => dispatch(actionCreators.deleteRecommend()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
