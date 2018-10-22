import Api from '@bedegaming/spine-player-client-js'
import * as config from 'tlob-theme-config/config.yml'

// Login
export function apiLogin(data) {
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.login(data)
}

export function decodeId(session) {
  return JSON.parse(window.atob(session.access_token.split('.')[1]))
}

// Profile
export function apiProfile(data) {
  console.log('Diane')
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.profile(data.playerId.sub, data.session)
}

// Wallets
export function apiWallets(data) {
  Api.host(config.ajax.qa02.url.api)
  Api.site(config.ajax.qa02.headers['X-Site-Code'])
  return Api.wallets(data.playerId.sub, data.session)
}
