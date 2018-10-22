import React from 'react'

const Button = ({ className, onClick, title }) => (
  <button className={className} onClick={onClick}>
    <span>{title}</span>
  </button>
)

export default Button
