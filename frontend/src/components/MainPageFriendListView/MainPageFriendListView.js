import React from 'react';

const MainPageFriendListView = (props) => { // TODO: props.friends
  const friendlist = props;
  const list = friendlist.friends.map((friend) => (
    <div className="FriendList" key={friend.id} style={{height:"100px", width:"100%"}}>
      <button type="button" id="friend-status" style={{height:"100%",width:"100%"}}>
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
