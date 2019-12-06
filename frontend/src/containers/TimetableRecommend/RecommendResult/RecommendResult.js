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
      courses: [],
      calculating: true,
    };
  }

  componentDidMount() {
    this.props.onGetRecommend()
      .then((res) => {
        console.log(res)
        return this.setState((prevState) => ({...prevState, calculating: false}))
      });
  }

  changeview(newcourses) {
    this.setState((prevState) => ({ ...prevState, courses: newcourses }));
  }

  onClickSave () {
    this.props.onPostTimetable("New timetable", "")
      .then((res) => {
        const timetable_id = res.timetable.id
        const courses = this.state.courses
        for (let i = 0; i < courses.length; i += 1) {
          console.log(courses[i])
          this.props.onPostCourse(timetable_id, courses[i].id)
        }
      })
  }

  render() {
    const tableviewlist = [];
    for (let i = 0; i < this.props.timetable.length; i += 1) {
      tableviewlist.push(
        <div
          key={i}
          className="recommended-timetable-space"
          role="button"
          tabIndex={0}
          onClick={() => this.changeview(this.props.timetable[i].course)}
          onKeyDown={() => this.changeview(this.props.timetable[i].course)}
        >
          <TimetableView
            id="timetable-one-result"
            height={4}
            courses={this.props.timetable[i].course}
            text={false}
            link={false}
            title=""
          />
        </div>,
      );
    }
    return (
      <div className="RecommendResult row">
        <div className="recommended-result-list col-3">
          {tableviewlist}
        </div>
        <div className="timetable-result-space col-9">
          <div className="timetable-result">
            <TimetableView
              id="timetable-resultview"
              height={24}
              courses={this.state.courses}
              text
              link={false}
              title=""
            />
          </div>
          <div className="buttons">
            <div className="save-space">
              <button type="button" id="save-button" style={{ width: '100%' }} onClick={() => this.onClickSave()}>SAVE</button>
            </div>
            <div className="close-space">
              <button
                type="button"
                id="close-button"
                style={{ width: '100%' }}
              >
CLOSE
              </button>
            </div>
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
  onPostTimetable: (title, semester) => dispatch(actionCreators.postTimetable(title, semester)),
  onPostCourse: (timetable_id, course_id) => dispatch(actionCreators.postCourse(timetable_id, course_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecommendResult);
