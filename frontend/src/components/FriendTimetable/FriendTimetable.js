import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TimetableView from '../TimetableView/TimetableView';
import './FriendTimetable.css';

const FriendTimetable = (props) => (
  <div className="popup">
    <div className="popup_inner">
      <div className="timetable-show">
        <TimetableView
          id="timetable-table"
          height={20}
          width={80}
          courses={props.timetable}
          text
          link
          title={props.title}
        />
      </div>
      <div className="close-space">
        <button
          type="button"
          id="close-button"
          style={{ width: '100%' }}
          onClick={props.closePopup}
        >
CLOSE
        </button>
      </div>
    </div>
  </div>
);

FriendTimetable.propTypes = {
  title: PropTypes.string.isRequired,
  closePopup: PropTypes.func.isRequired,
  timetable: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    weekday: PropTypes.number,
    start_time: PropTypes.number,
    end_time: PropTypes.number,
    color: PropTypes.string,
    lecture_number: PropTypes.string,
    course_number: PropTypes.string,
  })).isRequired,
};

export default connect(null, null)(FriendTimetable);