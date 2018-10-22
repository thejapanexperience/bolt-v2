// Packages
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// Components
// actionCreators
import { actions } from '../..'
const { logInUser, getUserProfile, getUserWallets } = actions

function HOLogin(Login) {
  return class HigherOrderLogin extends Component {
    state = {
      username: '',
      password: '',
    }

    handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value,
      })
    }

    handleSubmit = () => {
      const { username, password } = this.state
      this.props.logInUser({ username, password })
    }

    handleGetTransactions = () => {
      const { playerId, session } = this.props.userSession
      this.props.getUserProfile({ playerId, session })
      this.props.getUserWallets({ playerId, session })
    }

    render() {
      const { username, password } = this.state
      const state = { username, password }
      const { handleChange, handleSubmit, handleGetTransactions } = this
      const functions = { handleChange, handleSubmit, handleGetTransactions }

      return <Login {...this.props} {...state} {...functions} />
    }
  }
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  userSession: store.userSession,
})
// Pass actionCreators into props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ logInUser, getUserProfile, getUserWallets }, dispatch)

export default function ReduxLogin(Login) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(HOLogin(Login))
}
