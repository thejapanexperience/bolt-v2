// Packages
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// Components
// actionCreators
import { actions } from '../..'
const { setModal } = actions

function ModalsHO(Modals) {
  return class HigherOrderLogin extends Component {
    render() {
      return <Modals {...this.props} />
    }
  }
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  modals: store.modals,
})
// Pass actionCreators into props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setModal }, dispatch)

export default function ReduxModalsHO(Modals) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalsHO(Modals))
}
