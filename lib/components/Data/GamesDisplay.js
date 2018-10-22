import React from 'react'

const GamesDisplay = ({ gamesDisplay }) => {
  return (
    <div className="container gamesContainer">
      <div className="content">
        <h3>Games</h3>
        {gamesDisplay}
      </div>
    </div>
  )
}

export default GamesDisplay
