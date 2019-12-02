import React from 'react';
import PropTypes from 'prop-types';

const CourseElement = (props) => {
  const { course } = props;

  return (
    <div key={course.id}>
      <div className="d-flex mx-2">
        <div className="flex-grow-1">
          <div className="text-left">
            {course.title}
          </div>
          <div className="text-black-50 text-left small" id="recommend-course-abstract">
            {`${course.professor} | ${course.credit}학점 | ${course.time} | ${course.location}`}
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
