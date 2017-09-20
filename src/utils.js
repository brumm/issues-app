import parseLinkHeader from 'parse-link-header'
import tinycolor from 'tinycolor2'

export const mapObject = (object, callback) =>
  Object.keys(object).map(key => callback(key, object[key]))

export const filterObject = (object, callback) =>
  Object.keys(object).filter(key => callback(key, object[key]))

export const ghRequestAll = ({ url, headers, mapToResult = ({ items }) => items }) => {
  url = new URL(`https://api.github.com/${url}`)
  url.searchParams.set('page', 1)
  url.searchParams.set('per_page', 100)

  return fetch(url, { headers }).then(firstResponse => {
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
      }),
    ]).then(([...items]) => [].concat(...items))
  })
}

export const getReadableColor = (hex, options) => {
  options = {
    amount: 0.5,
    xMulti: 1,
    // We want to achieve white a bit sooner in the y axis
    yMulti: 1.5,
    normalizeHue: [20, 180],
    // For colors that appear lighter (yellow, green, light blue) we reduce the distance in the x direction,
    // stretching the radius in the x axis allowing more black than before.
    normalizeHueXMulti: 1 / 2.5,
    normalizeHueYMulti: 1,
    ...options,
  }

  const color = tinycolor(hex)
  const hsv = color.toHsv()

  // Origin is white
  const coord = {
    x: hsv.s,
    y: 1 - hsv.v,
  }

  // Multipliers
  coord.x *= options.xMulti
  coord.y *= options.yMulti

  if (options.normalizeHue && hsv.h > options.normalizeHue[0] && hsv.h < options.normalizeHue[1]) {
    coord.x *= options.normalizeHueXMulti
    coord.y *= options.normalizeHueYMulti
  }

  const dist = Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2))

  if (dist < options.amount) {
    hsv.v = 0 // black
  } else {
    hsv.v = 1 // white
  }
  hsv.s = 0

  return tinycolor(hsv).toHexString()
}
