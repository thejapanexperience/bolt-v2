import React, { Component } from 'react'

export default class Header extends Component {

  render() {

    const { className, siteTitle } = this.props

    return(
      <Header className={className}>
        <h1>{siteTitle}</h1>
      </Header>
    )
  }
}
