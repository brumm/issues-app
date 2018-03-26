import React from 'react'

import remark from 'remark'
import reactRenderer from 'remark-react'
import github from 'remark-github'
import emoji from 'remark-emoji'
import taskListPlugin from 'remark-task-list'
import SyntaxHighlighter from 'react-syntax-highlighter'

import ExternalLink from 'components/ExternalLink/ExternalLink'
import './GithubFlavoredMarkdown.scss'

const remarkReactComponents = {
  a: ({ children, href }) => <ExternalLink url={href}>{children}</ExternalLink>,
  input: props => {
    switch (props.type) {
      case 'checkbox':
        return <input type={props.type} checked={props.checked} onChange={console.log} />
      default:
        return <input {...props} />
    }
  },
  code: ({ className, ...props }) => {
    if (className) {
      const language = className.slice(9)
      return <SyntaxHighlighter language={language} {...props} useInlineStyles={false} />
    } else {
      return <code {...props} />
    }
  },
}

export default class GithubFlavore1dMarkdown extends React.PureComponent {
  render() {
    const { source, repository, className, ...otherProps } = this.props
    const md = remark()
      .use({
        gfm: true,
      })
      .use(emoji)
      .use(github, {
        repository,
        mentionStrong: false,
      })
      .use(taskListPlugin)
      .use(reactRenderer, {
        sanitize: false,
        remarkReactComponents,
      })

    const { contents } = md.processSync(source)
    return (
      <div
        {...otherProps}
        style={{
          flexShrink: 0,
        }}
        className={[className, 'markdown-body'].join(' ')}
      >
        {contents}
      </div>
    )
  }
}
