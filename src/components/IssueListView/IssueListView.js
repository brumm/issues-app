import React from 'react'
import { NavLink } from 'react-router-dom'
import Flex from 'flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'
import striptags from 'striptags'
import parseGithubUrl from 'parse-github-url'

import { Column } from 'components/Layout'

import css from './IssueListView.scss'

class ListItem extends React.Component {
  render() {
    const {
      body,
      comments,
      id,
      number,
      pull_request,
      state,
      title,
      url,
    } = this.props
    const { repo } = parseGithubUrl(url)
    const truncatedBody = removeMarkdown(striptags(body)).slice(0, 200)

    return (
      <NavLink
        to={`/${id}`}
        className={[css.item, state].join(' ')}
        activeClassName={css.itemSelected}
        key={id}
      >
        <Flex className={css.repo} alignItems='center'>
          {this.props.unread && <div className={css.unreadMarker} />}

          {`${repo}/${this.props.number}`}

          {comments > 0 &&
            <Flex className={css.commentCount} alignItems='center'>
              <Octicon name='comment' />
              {comments}
            </Flex>
          }
        </Flex>

        <div className={css.title}>
          <Octicon name={
            pull_request !== undefined
            ? 'git-pull-request'
              : state === 'closed'
                ? 'issue-closed'
                : 'issue-opened'
          } />

        {title}
        </div>

        {truncatedBody.length > 0 &&
          <div className={css.body}>
            {truncatedBody}
          </div>
        }
      </NavLink>
    )
  }
}

export default class IssuesList extends React.Component {
  render() {
    return (
      <Column grow={1} className={css.container}>
        {this.props.issues.map(issue => (
          <ListItem
            key={issue.id}
            {...issue}
          />
        ))}
      </Column>
    )
  }
}
