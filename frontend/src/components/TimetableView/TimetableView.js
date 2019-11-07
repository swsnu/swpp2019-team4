import React from 'react';
import PropTypes from 'prop-types';
import './TimetableView.css';
/*
 * INPUT: props.courses parsed as below
 * [{"week_day": 0, "start_time": 660, "end_time": 750, "name": "NAME OF EACH COURSE", "color": "#FFFFFF", "course_number": "COU.NUM", "lecture_number": "001"}, {}, ...]
 * week_day is 0~5 integer. Monday is 0, Tuesday is 1, ... Saturday is 5
 * start_time, end_time are 660~1230 integer. This value is hour*60+minute (8:00~20:30). start_time must be divided by 30
 * color is 6 hexadigit number.
 * height is constant value, and width is max width percent value
 * text is true of false. If text if true, text will show. If false, text will not show and can display more smaller
*/


const TimetableView = (props) => {
  const tableHeaderString = ['', 'M', 'T', 'W', 'T', 'F', 'S'];
  const coursesList = [[], [], [], [], [], []];
  const tablehtml = [];
  let tablehtmlIth = [];
  const heightunit = props.height;
  const widthunit = '14%';
  for (let i = 0; i < 26; i += 1) {
    for (let j = 0; j < 6; j += 1) {
      coursesList[j].push([]);
    }
  }
  for (let i = 0; props.courses !== undefined && i < props.courses.length; i += 1) {
    coursesList[props.courses[i].week_day][props.courses[i].start_time / 30 - 16].push(
      {
        name: props.text ? props.courses[i].name : '',
        length: props.courses[i].end_time - props.courses[i].start_time,
        color: props.courses[i].color,
        lecnum: props.courses[i].lecture_number,
        clanum: props.courses[i].course_number,
      },
    );
  }
  for (let i = 0; i < 7; i += 1) {
    tablehtmlIth.push(<th key={i} height={heightunit} width={widthunit}>{props.text ? tableHeaderString[i] : ''}</th>);
  }
  tablehtml.push(<tr key={-1}>{tablehtmlIth}</tr>);
  for (let i = 0; i < 26; i += 1) {
    tablehtmlIth = [];
    if (i % 2 === 0) {
      tablehtmlIth.push(
        <td
          key={1000 * i + 1000}
          height={2 * heightunit}
          width={widthunit}
          rowSpan={2}
        >
          {props.text ? `${i / 2 + 8}:00` : ''}
        </td>,
      );
    }
    for (let j = 0; j < 6; j += 1) {
      if (coursesList[j][i].length === 0) {
        tablehtmlIth.push(<td key={1000 * i + j + 1001} height={heightunit} width={widthunit} />);
      } else {
        tablehtmlIth.push(
          <td key={1000 * i + j} height={heightunit} width={widthunit}>
            {
              coursesList[j][i].map(
                (course) => {
                  const square = (
                    <div
                      className="square"
                      key={1}
                      style={
                      {
                        height: `${((heightunit * course.length) / 30) + 6}px`,
                        width: `${(14 * props.width) / 100}%`,
                        backgroundColor: course.color,
                        color: 'black',
                      }
                    }
                    >
                      {course.name}
                    </div>
                  );
                  if (props.link === true) {
                    return (
                      <a
                        href={'http://sugang.snu.ac.kr/sugang/cc/cc101.action?'
                      + 'openSchyy=2019&openShtmFg=U000200002&openDetaShtmFg='
                      + `U000300001&sbjtCd=${course.clanum}`
                      + `&ltNo=${course.lecnum}&sugangFlag=P`}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={0}
                      >
                        {square}
                      </a>
                    );
                  }
                  return square;
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
      <table id="timetable" border="1" bordercolor="black" style={{ alignItem: 'center', width: '100%' }}>
        <caption>{props.title}</caption>
        <tbody>
          {tablehtml}
        </tbody>
      </table>
    </div>
  );
};

TimetableView.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
      week_day: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      lecture_number: PropTypes.string.isRequired,
      course_number: PropTypes.string.isRequired,
    }),
  ).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  text: PropTypes.bool.isRequired,
  link: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};
export default TimetableView;
