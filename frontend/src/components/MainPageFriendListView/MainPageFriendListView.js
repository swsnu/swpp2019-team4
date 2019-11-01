import React from 'react';

const MainPageFriendListView = (props) => { // TODO: props.friends
  const list = props.friends.map((friend) => (
    <div className="FriendList" key={friend.id}>
      <button id="friend-status">
        {friend.name}
        <br />
        {`${(friend.inclass ? '수업:' : '공강:') + friend.timeleft}min left`}
      </button>
      <br />
    </div>
  ));
  return (
    <div className="MainPageFriendListView">
            FRIENDLIST
      <br />
      {list}
    </div>
  );
};

export default MainPageFriendListView;
