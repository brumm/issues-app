import React from 'react'
import { shell } from 'electron'

export default ({ url, children }) => (
  <a
    href={url}
    onClick={e => {
      e.preventDefault()
      shell.openExternal(url)
    }}
  >
    {children}
  </a>
)
