// imports
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actionCreators
class Data extends Component {
  jsonRender(data, selector = false) {
    return (
      <div>
        {data.map((data, i) => {
          if (selector) {
            data = data[selector]
          }
          return (
            <div key={i}>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const { winnersFeed, games, userSession } = this.props
    console.log('userSession: ', userSession)
    console.log('winnersFeed: ', winnersFeed)
    console.log('games: ', games)

    let userSessionDisplay = 'No User'
    let gamesDisplay = 'No Games'
    let winnersFeedDisplay = 'No Winners'

    if (userSession) {
      userSessionDisplay = (
        <div>
          <pre>{JSON.stringify(userSession, null, 2)}</pre>
        </div>
      )
    }

    if (games.length > 0) {
      gamesDisplay = this.jsonRender(games, 'displayName')
    }

    if (winnersFeed.length > 0) {
      winnersFeedDisplay = this.jsonRender(winnersFeed)
    }

    return (
      <div>
        <h1>Data </h1>
        <h3>User</h3>
        {userSessionDisplay}
        <h3>Winners Feed</h3>
        {winnersFeedDisplay}
        <h3>Games</h3>
        {gamesDisplay}
      </div>
    )
  }
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  winnersFeed: store.winnersFeed,
  games: store.games,
  userSession: store.userSession,
})
// Pass actionCreators into props
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Data)
