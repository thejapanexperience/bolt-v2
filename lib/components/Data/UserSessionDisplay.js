import React from 'react'

const UserSessionDisplay = ({ userSessionDisplay }) => {
  return (
    <div className="container userSessionContainer">
      <div className="content">
        <h3>User</h3>
        {userSessionDisplay}
      </div>
    </div>
  )
}

export default UserSessionDisplay
