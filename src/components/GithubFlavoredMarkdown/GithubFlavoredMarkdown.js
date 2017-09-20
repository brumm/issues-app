import React from 'react'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'
import highlightIt from 'markdown-it-highlightjs'
import taskLists from 'markdown-it-task-lists'

import './GithubFlavoredMarkdown.scss'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

md.use(emojiIt)
md.use(highlightIt, { auto: true, code: false })
md.use(taskLists, { enabled: true })

export default class GithubFlavoredMarkdown extends React.Component {
  render() {
    const { source, className, ...otherProps } = this.props
    return (
      <div
        {...otherProps}
        style={{
          flexShrink: 0,
        }}
        dangerouslySetInnerHTML={{ __html: md.render(source) }}
        className={`${className} markdown-body`}
      />
    )
  }
}
