import React from 'react';

const MainPageFriendListView=(props)=>{//TODO: props.friends
    var list=props.friends.map(friend=><div className="FriendList"><button id="friend-status" key="friend-id">{friend.name}<br/>{(friend.inclass?"수업:":"공강:")+friend.timeleft+"min left"}</button><br/></div>)
    return (
        <div className='MainPageFriendListView'>
            FRIENDLIST<br/>
            {list}
        </div>
    );
};

export default MainPageFriendListView;