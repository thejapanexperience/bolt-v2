import React from 'react'

const Button = ({ className, onClick, title }) => (
  <button
    className={className}
    onClick={onClick}
  >
    {title}
  </button>
)

export default Button
