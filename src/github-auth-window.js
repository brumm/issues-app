import { remote } from 'electron'
const { BrowserWindow } = remote

const authWindow = null

export default parent => new Promise((resolve, reject) => {
  const handleCallback = url => {
    let regex = /token=([a-z0-9]+$)/
    if (regex.test(url)) {
      let [match, token] = url.match(regex)
      if (match) {
        authWindow.destroy()
        authWindow = null
        resolve(token)
      }
    }
  }

  let authWindow = new BrowserWindow({
    parent,
    modal: true,
    show: false,
    width: 1020,
    height: 610,
    webPreferences: {
      nodeIntegration: false
    }
  })

  authWindow.loadURL('http://whatsgit-auth.apps.railslabs.com/login')

  authWindow.once('ready-to-show', authWindow.show)

  authWindow.webContents.on('will-navigate', (event, url) => {
    handleCallback(url)
  })

  authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    handleCallback(newUrl)
  })

  authWindow.on('close', () => {
    reject()
    authWindow.destroy()
  })
})
