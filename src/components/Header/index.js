import React from 'react'
import styled from 'styled-components'

const Header = styled.div`
  background-color: rebeccapurple;
  margin-bottom: 2rem;
`

export default ({ siteTitle }) => (
  <Header>
    <h1>{siteTitle}</h1>
  </Header>
)
