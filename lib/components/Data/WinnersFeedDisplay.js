import React from 'react'

const WinnersFeedDisplay = ({ winnersFeedDisplay }) => {
  return (
    <div className="container winnersFeedContainer">
      <div className="content">
        <h3>Winners Feed</h3>
        {winnersFeedDisplay}
      </div>
    </div>
  )
}

export default WinnersFeedDisplay
