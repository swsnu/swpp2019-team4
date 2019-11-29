import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CourseDetail from '../../containers/CourseDetail/CourseDetail';
import './TimetableView.css';

class TimetableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {
        title: '',
        color: '',
        lecture_number: '',
        course_number: '',
      },
    };
  }

  openCourseDetail(course) {
    this.setState((prevState) => ({ ...prevState, course }));
  }

  render() {
    /*
    * week_day is 0~5 integer. Monday is 0, Tuesday is 1, ... Saturday is 5
    * start_time, end_time are 660~1230 integer. This value is hour*60+minute (8:00~20:30). start_time must be divided by 30
    * height is constant value, and color is 6 hexadigit number.
    * text is true of false. If text if true, text will show. If false, text will not show and can display more smaller
    */

    /* temporary color palette from https://clrs.cc
    * 11 colors (excluding 3 grayscale colors and 2 dark colors)
    const colors = ['#FF851B', '#FFDC00', '#39CCCC', '#01FF70', '#F012BE', '#FF4136', '#7FDBFF',
      '#3D9970', '#B10DC9', '#2ECC40', '#0074D9'];
    */

    const tableHeaderString = ['', 'M', 'T', 'W', 'T', 'F', 'S'];
    const coursesList = [[], [], [], [], [], []];
    const tablehtml = [];
    let tablehtmlIth = [];
    const heightunit = this.props.height;
    for (let i = 0; i < 26; i += 1) {
      for (let j = 0; j < 6; j += 1) {
        coursesList[j].push([]);
      }
    }
    if (this.props.courses !== undefined) {
      for (let i = 0; i < this.props.courses.length; i += 1) {
        for (let j = 0; j < this.props.courses[i].time.length; j += 1) {
          const segment = this.props.courses[i].time[j];
          coursesList[segment.week_day][segment.start_time / 30 - 16].push(
            {
              index: i,
              title: this.props.text ? this.props.courses[i].title : '',
              length: (parseInt((segment.end_time - segment.start_time) / 30, 10) + 1) * heightunit,
              color: this.props.courses[i].color,
              // color: colors[i % colors.length],
            },
          );
        }
      }
    }
    for (let i = 0; i < 7; i += 1) {
      tablehtmlIth.push(<th key={i} height={heightunit}>{this.props.text ? tableHeaderString[i] : ''}</th>);
    }
    tablehtml.push(<tr key={-1}>{tablehtmlIth}</tr>);
    for (let i = 0; i < 26; i += 1) {
      tablehtmlIth = [];
      if (i % 2 === 0) {
        tablehtmlIth.push(
          <td
            className="text-right pr-2 py-0 small text-black-50"
            key={1000 * i + 1000}
            rowSpan={2}
          >
            {this.props.text ? `${i / 2 + 8}` : ''}
          </td>,
        );
      }
      for (let j = 0; j < 6; j += 1) {
        if (coursesList[j][i].length === 0) {
          tablehtmlIth.push(<td key={1000 * i + j + 1001} height={heightunit} />);
        } else {
          tablehtmlIth.push(
            <td key={1000 * i + j} height={heightunit}>
              {
                coursesList[j][i].map(
                  (course) => {
                    const dataTarget = this.props.link ? '#course-detail' : '';
                    return (
                      <div
                        className="square small rounded-sm"
                        key={course.index * 1000 + j}
                        style={{
                          height: `${course.length}px`,
                          backgroundColor: course.color,
                        }}
                        role="button"
                        tabIndex="0"
                        data-toggle="modal"
                        data-target={dataTarget}
                        onClick={() => this.openCourseDetail(this.props.courses[course.index])}
                        onKeyDown={() => this.openCourseDetail(this.props.courses[course.index])}
                      >
                        <div className="title px-1 text-black">
                          <b>{course.title}</b>
                        </div>
                      </div>

                    );
                  },
                )
              }
            </td>,
          );
        }
      }
      tablehtml.push(<tr key={-i - 2}>{tablehtmlIth}</tr>);
    }
    return (
      <div className="TimetableView">
        <table id="timetable" border="1" bordercolor="black">
          <colgroup>
            <col span="1" style={{ width: '10%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '15%' }} />
          </colgroup>
          <tbody>
            {tablehtml}
          </tbody>
        </table>
        <CourseDetail id="course-detail" course={this.state.course} />
      </div>
    );
  }
}

TimetableView.defaultProps = {
  courses: [],
  text: true,
  link: true,
};

TimetableView.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    lecture_number: PropTypes.string.isRequired,
    course_number: PropTypes.string.isRequired,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
      week_day: PropTypes.number.isRequired,
    })),
  })),
  height: PropTypes.number.isRequired,
  text: PropTypes.bool,
  link: PropTypes.bool,
};
export default TimetableView;
