import React from 'react';
import PropTypes from 'prop-types';

const MainPageFriendView = (props) => { // TODO: props.friends
  const friend = props.friend;
  const courses = props.courses;
  const date = new Date();
  const week_day = (date.getDay() + 6) % 7;
  const time = date.getHours() * 60 + date.getMinutes();

  let inClass = false;
  let timeLeft = 10000;
  let currentClass = '';
  //let nextClass = '';
  for(let i = 0; i < courses.length; i++) {
    if(courses[i].week_day === week_day) {
      if(courses[i].start_time <= time && time < courses[i].end_time){
        inClass = true;
        timeLeft = courses[i].end_time - time;
        currentClass = courses[i].name;
      }
      else if(!inClass && time < courses[i].start_time && timeLeft > courses[i].start_time-time) {
        timeLeft = courses[i].start_time - time;
        //nextClass = courses[i].name;
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
        {inClass ? currentClass + timeLeft + '분 남음' : '공강 ' + (timeLeft < 240 ? timeLeft + '분 남음' : '')}
      </button>
      <br/>
    </div>
  );
};

MainPageFriendView.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MainPageFriendView;
