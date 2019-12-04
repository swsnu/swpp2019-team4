import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actionCreators from '../../store/actions/index';
import { TwitterPicker } from 'react-color';
import './CourseDetail.css';

class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.course.color !== this.props.course.color) {
      this.setState({
        color: nextProps.course.color,
      });
    }
  }

  handleColor(color) {
    this.setState({color: color});
    this.props.onEditCourse(this.props.course.id, { color: color });
  }

  render() {
    const course = this.props.course;
    const isCustom = course.is_custom;
    const href = 'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
      + `U000300001&sbjtCd=${course.course_number}`
      + `&ltNo=${course.lecture_number}&sugangFlag=P`;

    const weekDayName = ['월', '화', '수', '목', '금', '토', '일'];
    const timeString = (time) => {
      const hour = Math.floor(time / 60);
      const minute = time - hour * 60;
      const hourString = "" + hour;
      const minuteString = minute < 10 ? "0" + minute : "" + minute;
      return hourString + ":" + minuteString;
    }
    const timeDiv = course.time.map((segment, index) => {
      return (
        <div key = {index}>
          {weekDayName[segment.week_day] + " (" + timeString(segment.start_time) + " ~ " + timeString(segment.end_time) + ")"}
        </div>
      );
    });

    return (
      <div className="CourseDetail modal fade" id={this.props.id} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {course.title}
              </h5>
            </div>
            <div className="modal-body">
              <table className="table">
                <tbody>
                  {!isCustom ? 
                  <tr>
                    <td>강좌번호</td>
                    <td>{course.course_number}</td>
                  </tr>
                  : null}
                  {!isCustom ? 
                  <tr>
                    <td>분반번호</td>
                    <td>{course.lecture_number}</td>
                  </tr>
                  : null}
                  {!isCustom ? 
                  <tr>
                    <td>학점</td>
                    <td>{course.credit}</td>
                  </tr>
                  : null}
                  {!isCustom ?
                  <tr>
                    <td>교수</td>
                    <td>{course.professor}</td>
                  </tr>
                  : null}
                  {!isCustom ?
                  <tr>
                    <td>장소</td>
                    <td>{course.location}</td>
                  </tr>
                  : null}
              
                  <tr>
                    <td>시간</td>
                    <td>
                      {timeDiv}
                    </td>
                  </tr>
                  {!isCustom ? 
                  <tr>
                    <td>링크</td>
                    <td><a href={href} rel="noopener noreferrer" target="_blank">세부 정보</a></td>
                  </tr>
                    : null}
                  <tr>
                  <td>색상</td>
                  <td>
                    <div className="dropdown">
                      <button
                        type="button"
                        id="dropdown-color"
                        data-toggle="dropdown"
                        aria-labelledby="Dropdown Color"
                        style={{ backgroundColor: this.state.color }}
                        disabled={!this.props.editable}
                      />
                      <div className="dropdown-menu">
                        <TwitterPicker
                          color={course.color}
                          onChangeComplete={(color) => this.handleColor(color.hex)}
                        />
                      </div>
                    </div>
                  </td></tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" data-dismiss="modal">닫기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  onEditCourse: (courseId, changedValues) => dispatch(actionCreators.editCourse(courseId, changedValues)),
});

CourseDetail.defaultProps = {
  editable: false,
}

CourseDetail.propTypes = {
  id: PropTypes.string.isRequired,
  course: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number,
      end_time: PropTypes.number,
      week_day: PropTypes.number,
    })).isRequired,
  }).isRequired,
  editable: PropTypes.bool,
  onEditCourse: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
