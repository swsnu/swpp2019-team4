import React from 'react';
import PropTypes from 'prop-types';

const MainPageFriendView = (props) => {
  const { friend } = props;
  const courses = props.friend.timetable;
  const date = new Date();
  const dateLocal = new Date(date.getTime() + 9 * 60 * 60000); // Hardcoded utc+9
  const weekDay = (dateLocal.getUTCDay() + 6) % 7;
  const time = dateLocal.getUTCHours() * 60 + dateLocal.getUTCMinutes();

  let inClass = false;
  let timeLeft = 10000;
  let currentClass = '';
  // let nextClass = '';
  for (let i = 0; i < courses.length; i += 1) {
    if (courses[i].week_day === weekDay) {
      if (courses[i].start_time <= time && time < courses[i].end_time) {
        inClass = true;
        timeLeft = courses[i].end_time - time;
        currentClass = courses[i].title;
      } else if (!inClass && time < courses[i].start_time && timeLeft > courses[i].start_time - time) {
        timeLeft = courses[i].start_time - time;
        // nextClass = courses[i].name;
      }
    }
  }
  return (
    <div className="FriendSummary" key={friend.id} style={{ height: '100px', width: '100%' }}>
      <button
        type="button"
        id="friend-status"
        style={{ height: '100%', width: '100%' }}
        onClick={() => props.onClick(friend.id)}
      >
        {friend.name}
        <br />
        {inClass ? `${currentClass}\n${timeLeft}분 남음` : `공강\n${timeLeft < 240 ? `${timeLeft}분 남음` : ''}`}
      </button>
      <br />
    </div>
  );
};

MainPageFriendView.propTypes = {
  onClick: PropTypes.func.isRequired,
  friend: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    timetable: PropTypes.arrayOf(
      PropTypes.shape({
        week_day: PropTypes.number.isRequired,
        start_time: PropTypes.number.isRequired,
        end_time: PropTypes.node.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default MainPageFriendView;
