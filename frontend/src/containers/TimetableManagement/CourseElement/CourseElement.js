import React from 'react';
import PropTypes from 'prop-types';

const CourseElement = (props) => {
  const segmentToString = (weekDay, startTime) => {
    const weekDayName = ['월', '화', '수', '목', '금', '토'];
    const hour = parseInt(startTime / 60, 10);
    const hourString = (hour < 10 ? '0' : '') + hour;
    const minuteString = (startTime % 60 === 0 ? '' : '.5');
    return `${weekDayName[weekDay]}${hourString}${minuteString}`;
  };
  const { course } = props;
  const colorGradient = [
    '#FC466B',
    '#E94879',
    '#D64A87',
    '#C34D96',
    '#B04FA4',
    '#9D52B3',
    '#8A54C1',
    '#7756CF',
    '#6459DE',
    '#515BEC',
    '#3F5EFB',
  ];
  let timeString = '';
  for (let i = 0; i < course.time.length; i += 1) {
    timeString += segmentToString(course.time[i].week_day, course.time[i].start_time);
    if (i !== course.time.length - 1) {
      timeString += ' ';
    }
  }
  return (
    <div key={course.id}>
      <div className="d-flex mx-2">
        <div className="flex-grow-1">
          <div className="text-left">
            {course.title+' ('+course.lecture_number+')'}
          </div>
          <div className="text-black-50 text-left small" id="recommend-course-abstract">
            {`${course.professor} | ${course.credit}학점 | ${timeString} | ${course.location}`}
          </div>
        </div>
        {props.addon}
      </div>
      <hr className="my-2" />
    </div>
  );
};

CourseElement.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    professor: PropTypes.string,
    credit: PropTypes.number,
    location: PropTypes.string,
    time: PropTypes.arrayOf(
      PropTypes.shape({
        week_day: PropTypes.number,
        start_time: PropTypes.number,
        end_time: PropTypes.number,
      }),
    ),
  }).isRequired,
  addon: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
};

export default CourseElement;
