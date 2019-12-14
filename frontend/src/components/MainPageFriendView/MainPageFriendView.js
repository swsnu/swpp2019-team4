import React from 'react';
import PropTypes from 'prop-types';
import './MainPageFriendView.css';

const MainPageFriendView = (props) => {
  const { friend } = props;
  const courses = friend.timetable_main.course;
  const date = new Date();
  const dateLocal = new Date(date.getTime() + 9 * 60 * 60000); // Hardcoded utc+9
  const weekDay = (dateLocal.getUTCDay() + 6) % 7;
  const time = dateLocal.getUTCHours() * 60 + dateLocal.getUTCMinutes();

  let inClass = false;
  let timeLeft = 10000;
  let currentClass = '';
  // let nextClass = '';
  for (let i = 0; i < courses.length; i += 1) {
    for (let j = 0; j < courses[i].time.length; j += 1) {
      const term = courses[i].time[j];
      if (term.week_day === weekDay) {
        if (term.start_time <= time && time < term.end_time) {
          inClass = true;
          timeLeft = term.end_time - time;
          currentClass = courses[i].title;
        } else if (!inClass && time < term.start_time && timeLeft > term.start_time - time) {
          timeLeft = term.start_time - time;
        // nextClass = courses[i].name;
        }
      }
    }
  }
  return (
    <div
      className="MainPageFriendView w-100"
      key={friend.id}
      onClick={props.onClick}
      onKeyDown={props.onClick}
      role="button"
      tabIndex="-1"
    >
      <hr className="m-0" />
      <div className="d-flex flex-column justify-content-center h-100">
        <div className="d-flex flex-row">
          <div className="text-left px-2">
            {' '}
            {friend.username}
            {' '}
          </div>
          <div className="flex-grow-1 text-black-50 text-left px-2">
            <small>
              {`${friend.department} | ${Math.floor((friend.grade % 100) / 10)}${friend.grade % 10}학번`}
            </small>
          </div>
        </div>
        <div className={`small px-2 text-left ${inClass ? 'text-danger' : 'text-success'}`}>
          {inClass ? `${currentClass}\n${timeLeft}분 남음` : `공강\n${timeLeft < 240 ? `${timeLeft}분 남음` : ''}`}
        </div>
      </div>
    </div>
  );
};

MainPageFriendView.propTypes = {
  onClick: PropTypes.func.isRequired,
  friend: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    department: PropTypes.string,
    grade: PropTypes.number,
    timetable_main: PropTypes.shape({
      course: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        time: PropTypes.arrayOf(PropTypes.shape({
          week_day: PropTypes.number,
          start_time: PropTypes.number,
          end_time: PropTypes.number,
        })),
      })),
    }),
  }).isRequired,
};

export default MainPageFriendView;
