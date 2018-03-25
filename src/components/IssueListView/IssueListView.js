import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import parseGithubUrl from 'parse-github-url'
import TimeAgo from 'react-timeago'
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized'

import { mapObject } from 'utils'

import 'react-virtualized/styles.css'
import ListItem from './ListItem'
import css from './IssueListView.scss'

class IssueListView extends React.Component {
  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 80,
    keyMapper: rowIndex => this.props.issues[rowIndex].id,
  })

  render() {
    const { issues, notifications, match } = this.props

    if (!match.params.issueId) {
      return <Redirect to={`/${match.params.filterId}/${issues[0].id}`} />
    }

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            className={css.container}
            style={{ flexGrow: 1 }}
            height={height}
            rowHeight={this.cache.rowHeight}
            rowCount={issues.length}
            deferredMeasurementCache={this.cache}
            rowRenderer={({ key, index, style, parent }) => (
              <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
              >
                <ListItem key={key} style={style} {...issues[index]} />
              </CellMeasurer>
            )}
            width={width}
          />
        )}
      </AutoSizer>
    )
  }
}

export default withRouter(IssueListView)
