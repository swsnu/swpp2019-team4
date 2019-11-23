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
      index: 0,
    };
  }

  componentDidMount() {
    this.props.onGetUser();
  }

  handleLogout() {
    this.props.onLogout();
  }

  movePage(offset) {
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
        content = (<RecommendConstraint />);
        break;
      case 1:
        content = (<RecommendTime />);
        break;
      case 2:
        content = (<RecommendCourse />);
        break;
      case 3:
        content = (<RecommendResult timetable={[{ course: [] }, { course: [] }]} />);
        break;
      default:
        content = null;
        break;
    }

    return (
      <div className="TimetableRecommend d-flex flex-column">
        <TopBar id="topbar" logout={() => this.handleLogout()} />
        <div className="row flex-grow-1" style={{ minHeight: 0 }}>
          <div className="col-2">
            HELLO
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
                    style={{ width: '100px' }}
                    onClick={() => this.movePage(-1)}
                  >
이전
                  </button>
                )
                : null}
              <button
                type="button"
                className="btn btn-dark"
                style={{ width: '100px' }}
                onClick={() => this.movePage(1)}
              >
다음
              </button>
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
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
