import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from 'store'
const {shell} = require('electron')

import { Row, Column } from 'components/Layout'
import UserBadge from 'components/UserBadge'
import GithubFlavoredMarkdown from 'components/GithubFlavoredMarkdown'
import parseGithubUrl from 'parse-github-url'

import css from './IssueDetailView.scss'

const ExternalLink = ({ url, children }) => (
  <a href={url} onClick={e => {
    e.preventDefault()
    shell.openExternal(url)
  }}>{children}</a>
)

@connect(({
  entities
}, { issueId }) => {
  const issue = entities.issues[issueId]
  console.log(issue)
  return {
    issue,
    comments: issue.commentIds.map(commentId => entities.comments[commentId]),
    author: entities.users[issue.user],
  }
}, actionCreators)

export default class IssueDetailView extends React.Component {
  componentWillMount() {
    this.props.loadComments(this.props.issue.id)
  }

  render () {
    const {
      issue: {
        title,
        url,
        html_url,
        number,
        body,
      },
      author,
      comments,
    } = this.props
    const { repo } = parseGithubUrl(html_url)
    console.log(comments)

    return (
      <Column style={{ height: '100%' }}>

        <Row alignItems='flex-start' className={css.header} shrink={0}>
          <UserBadge size={50} radius={3} avatar={author.avatar_url} />
          <Column className={css.details}>
            <ExternalLink url={html_url}>
              <div className={css.link}>{`${repo}/${number}`}</div>
            </ExternalLink>

            <div className={css.title}>{title}</div>
          </Column>
        </Row>

        <Column style={{overflowY: 'auto'}}>
          {body && <GithubFlavoredMarkdown source={body} />}

          {comments.map(({ body }) => (
            <GithubFlavoredMarkdown source={body} />
          ))}
        </Column>

      </Column>
    )
  }
}
