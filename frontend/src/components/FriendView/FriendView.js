import React from 'react';

const FriendView = (props) => {
    const friend = props;
    return (
        <div className="FriendView">
            {friend.username}
        </div>
    );
};

export default FriendView;