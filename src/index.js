import 'css/global'
import React from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import createStore from 'store'
import idbKeyval from 'idb-keyval'
import omit from 'lodash/omit'

import { initialFilterId } from 'store/reducers/filters'
import App from 'components/App/App'

const STATE_KEY = 'persistedState'
const BLACKLISTED_KEYS = ['requests']

idbKeyval.get(STATE_KEY).then(persistedState => {
  const store = createStore(persistedState)

  store.subscribe(() => idbKeyval.set(STATE_KEY, omit(store.getState(), BLACKLISTED_KEYS)))

  render(
    <Provider store={store}>
      <Router>
        <Route
          path="/:filterId?/:issueId?"
          render={({ match, history, location }) => (
            <App
              location={location}
              history={history}
              issueId={match.params.issueId}
              filterId={match.params.filterId}
            />
          )}
        />
      </Router>
    </Provider>,
    document.querySelector('#app')
  )
})
