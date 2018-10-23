// Packages
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// actionCreators
import { actions } from '../..'
const { getGames } = actions

function GamesListHO(GamesList) {
  return class HigherOrderGames extends Component {
    render() {
      const { games } = this.props

      if (!games || (games && games.length === 0)) {
        this.props.getGames()
      }

      return <GamesList {...this.props} />
    }
  }
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  games: store.games,
})
// Pass actionCreators into props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ getGames }, dispatch)

export default function ReduxGamesListHO(GamesList) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(GamesListHO(GamesList))
}
