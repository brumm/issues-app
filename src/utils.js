import parseLinkHeader from 'parse-link-header'

export const mapObject = (object, callback) => Object.keys(object).map(key => callback(key, object[key]))

export const ghRequestAll = ({
  url,
  headers,
  mapToResult = ({ items }) => items
}) => {
  url = new URL(`https://api.github.com/${url}`)
  url.searchParams.set('page', 1)
  url.searchParams.set('per_page', 100)

  return fetch(url, { headers })
    .then(firstResponse => {
      const links = parseLinkHeader(firstResponse.headers.get('Link'))
      if (!links) {
        return firstResponse.json().then(mapToResult)
      }

      const lastPage = parseInt(links.last.page, 10)
      const pages = Array.from({ length: lastPage - 1 }, (_, index) => 2 + index)

      return Promise.all([
        firstResponse.json().then(mapToResult),
        ...pages.map(page => {
          url.searchParams.set('page', page)

          return fetch(url, { headers })
            .then(res => res.json())
            .then(mapToResult)
        })
      ]).then(([...items]) => [].concat(...items))
    })
}
