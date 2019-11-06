import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import * as actionCreators from '../../store/actions/index';
import TimetableView from '../../components/TimetableView/TimetableView';
import './TimetableRecommend.css';

class TimetableRecommend extends Component {
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
    for (let i = 0; i < this.props.timetable.length; i += i + 1) {
      tableviewlist.push(
        <div
          key ={this.props.timetable[i].id}
          className="timetable"
          role="button"
          tabIndex={0}
          onClick={() => this.changeview(this.props.timetable[i])}
          onKeyDown={() => this.changeview(this.props.timetable[i])}
        >
          <TimetableView
            id="timetable-table"
            height={3}
            width={20}
            courses={this.props.timetable[i]}
            text={false}
            link={false}
            title=""
          />
        </div>,
      );
    }
    return (
      <div className="popup">
        <div className="popup_inner">
          <div className="timetable-list">
            {tableviewlist}
          </div>
          <div className="timetable-show">
            <div className="timetable-result">
              <TimetableView
                id="timetable-table"
                height={20}
                width={80}
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
                  onClick={this.props.closePopup}
                >
CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TimetableRecommend.propTypes = {
  closePopup: PropTypes.func.isRequired,
  timetable: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    course_name: PropTypes.string,
    weekday: PropTypes.number,
    start_time: PropTypes.number,
    end_time: PropTypes.number,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
  }))).isRequired,
};

export default connect(null, null)(TimetableRecommend);
/*
const mapStateToProps = (state) => ({
  storedUser: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  onGetUser: () => dispatch(actionCreators.getUser()),
  onLogout: () => dispatch(actionCreators.getSignout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimetableRecommend);
*/
