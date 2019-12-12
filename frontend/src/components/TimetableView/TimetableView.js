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
        is_custom: false,
        time: [],
      },
    };
    this.timeString = (time) => {
      const hour = Math.floor(time / 60);
      const minute = time - hour * 60;
      const hourString = `${hour}`;
      const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
      return `${hourString}:${minuteString}`;
    };
    this.forceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    setInterval(this.forceUpdate, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdate);
  }

  openCourseDetail(course) {
    this.setState((prevState) => ({ ...prevState, course }));
  }

  render() {
    /*
    * week_day is 0~5 integer. Monday is 0, Tuesday is 1, ... Saturday is 5
    * start_time, end_time are integers. This value is hour*60+minute.
    * height is constant value, and color is 6 hexadigit number.
    * text is true of false. If text if true, text will show. If false, text will not show and can display more smaller
    */

    /* temporary color palette from https://clrs.cc
    * 11 colors (excluding 3 grayscale colors and 2 dark colors)
    const colors = ['#FF851B', '#FFDC00', '#39CCCC', '#01FF70', '#F012BE', '#FF4136', '#7FDBFF',
      '#3D9970', '#B10DC9', '#2ECC40', '#0074D9'];
    */

    const minHour = 8;
    const maxHour = 21;

    const tableHeaderString = ['', 'M', 'T', 'W', 'T', 'F', 'S'];
    const coursesList = [[], [], [], [], [], []];
    const tablehtml = [];
    let tablehtmlIth = [];
    const heightunit = this.props.height / 8.5;

    const date = new Date();
    const dateLocal = new Date(date.getTime() + 9 * 60 * 60000); // Hardcoded utc+9
    const time = dateLocal.getUTCHours() * 60 + dateLocal.getUTCMinutes();
    const isCurrentBar = this.props.timeline && minHour * 60 < time && time < maxHour * 60;
    const currentPad = ((time % 60) / 60) * heightunit;

    for (let i = 0; i < maxHour - minHour; i += 1) {
      for (let j = 0; j < 6; j += 1) {
        coursesList[j].push([]);
      }
    }
    if (this.props.courses !== undefined) {
      for (let i = 0; i < this.props.courses.length; i += 1) {
        for (let j = 0; j < this.props.courses[i].time.length; j += 1) {
          const segment = this.props.courses[i].time[j];
          if (segment.week_day >= 0 && segment.week_day <= 5
            && segment.start_time < maxHour * 60 && segment.end_time > minHour * 60) {
            const startTime = Math.max(segment.start_time, minHour * 60);
            const endTime = Math.min(segment.end_time, maxHour * 60);
            const timeIndex = Math.floor(startTime / 60 - minHour);
            coursesList[segment.week_day][timeIndex].push(
              {
                index: i,
                title: this.props.text ? this.props.courses[i].title : '',
                top: `${((startTime % 60) / 60) * heightunit}rem`,
                length: `${((endTime - startTime) / 60) * heightunit}rem`,
                color: this.props.courses[i].color,
                opacity: (this.props.courses[i].opacity === undefined) ? 1.0 : this.props.courses[i].opacity,
              },
            );
          }
        }
      }
    }
    for (let i = 0; i < 7; i += 1) {
      tablehtmlIth.push(
        <th key={i} style={{ height: `${heightunit / 2}rem` }}>
          {this.props.text ? tableHeaderString[i] : ''}
        </th>,
      );
    }
    tablehtml.push(<tr key={-1}>{tablehtmlIth}</tr>);
    for (let i = minHour; i < maxHour; i += 1) {
      tablehtmlIth = [];
      tablehtmlIth.push(
        <td
          className="timetable-hour-bar text-right pr-2 py-0 small text-black-50"
          key={1000 * i + 1000}
        >
          {
        isCurrentBar && i === dateLocal.getUTCHours()
        && <div id="timetable-current-bar" style={{ top: `calc(${currentPad}rem - 1px)` }} />
        }
          {isCurrentBar && i === dateLocal.getUTCHours()
        && (
        <div className="rounded-sm" id="timetable-current-time" style={{ top: `${currentPad - 0.5}rem` }}>
          {this.timeString(time)}
        </div>
        )}
          {this.props.text ? `${i}` : ''}
        </td>,
      );
      for (let j = 0; j < 6; j += 1) {
        tablehtmlIth.push(
          <td key={1000 * i + j} style={{ height: `${heightunit}rem` }} className="timetable-hour-bar">
            {
        isCurrentBar && i === dateLocal.getUTCHours()
        && <div id="timetable-current-bar" style={{ top: `calc(${currentPad}rem - 1px)` }} />
        }
            {
                coursesList[j][i - minHour].map(
                  (course) => {
                    const dataTarget = this.props.link ? '#course-detail' : '';
                    return (
                      <div
                        className="square rounded-sm"
                        key={course.index * 1000 + j}
                        style={{
                          height: course.length,
                          top: course.top,
                          backgroundColor: course.color,
                          opacity: course.opacity,
                          zIndex: course.opacity > 0.9 ? 5 : 10,
                          cursor: this.props.link ? 'pointer' : 'default',
                        }}
                        role="button"
                        tabIndex="0"
                        data-toggle={this.props.link ? 'modal' : ''}
                        data-target={dataTarget}
                        onClick={() => (this.props.link
                          ? this.openCourseDetail(this.props.courses[course.index]) : null)}
                        onKeyDown={() => (this.props.link
                          ? this.openCourseDetail(this.props.courses[course.index]) : null)}
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
        <CourseDetail id="course-detail" course={this.state.course} editable={this.props.editable} />
      </div>
    );
  }
}

TimetableView.defaultProps = {
  courses: [],
  text: true,
  link: true,
  editable: false,
  timeline: false,
};

TimetableView.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
    time: PropTypes.arrayOf(PropTypes.shape({
      start_time: PropTypes.number,
      end_time: PropTypes.number,
      week_day: PropTypes.number,
    })),
    opacity: PropTypes.number,
  })),
  height: PropTypes.number.isRequired,
  text: PropTypes.bool,
  link: PropTypes.bool,
  editable: PropTypes.bool,
  timeline: PropTypes.bool,
};
export default TimetableView;
