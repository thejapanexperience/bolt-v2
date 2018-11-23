import uuid from 'node-uuid'
import { encodeURIObject } from './util.js'

class Api {
  /**
   * Error handling
   * ==============
   */

  /**
   * Handle Errors
   */

  errorHandler(e) {
    return Promise.reject(e.errors)
  }

  /**
   * Authentication
   * ==============
   */

  /**
   * Create a session by logging in as a player
   */
  static login(params) {
    return this.post('/players/sessions', params)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Create a session by using a session refresh token
   */
  static refresh(params) {
    return this.post('/players/sessions', params)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Destroy a session by logging out
   */
  static logout(session) {
    return this.delete('/players/sessions', false, session).catch(
      this.errorHandler
    )
  }

  /**
   * Player & profile
   * ================
   */

  /**
   * Create a new player
   */
  static register(params) {
    return this.post('/players', params)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Search for players
   */
  static players(params) {
    const query = encodeURIObject(params)
    return this.get(`/players?${query}`).catch(this.errorHandler)
  }

  /**
   * Search for an address
   */
  static addresses(params) {
    const query = encodeURIObject(params)
    return this.get(`/addresses?${query}`)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's profile
   */
  static profile(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/profile`, session)
      .then(this.parse)
      .then(json => json.player) // TODO: remove this?
      .catch(this.errorHandler)
  }

  /**
   * Update the player's profile
   */
  static updateProfile(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.patch(`/players/${playerId}/personal`, params, session).catch(
      this.errorHandler
    )
  }

  /**
   * Update the player's account status
   */
  static updateStatus(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.put(
      `/players/${playerId}/accountstatus`,
      params,
      session
    ).catch(this.errorHandler)
  }

  /**
   * Fetch the player's wallets
   */
  static wallets(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/wallets`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's balances
   */
  static balances(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/balances`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's activities
   */
  static activities(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)
    return this.get(`/players/${playerId}/activities?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Banking
   * =======
   */

  /**
   * Fetch the payment providers
   */
  static providers(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)
    return this.get(`/players/${playerId}/paymentproviders?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's payment entities
   */
  static entities(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)
    return this.get(`/players/${playerId}/paymententities?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Create a payment entity authorization token
   */
  static authorisation(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.post(
      `/players/${playerId}/paymententityauthorisations`,
      params,
      session
    )
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Add a payment entity for the player
   */
  static entity(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.post(`/players/${playerId}/paymententities`, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Make a deposit
   */
  static deposit(playerId, provider, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }
    const playerDepositPath = `/players/${playerId}/deposits`
    const path = provider
      ? `${playerDepositPath}/${provider}`
      : playerDepositPath

    return this.post(path, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Make a withdrawal
   */
  static withdraw(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.post(`/players/${playerId}/withdrawals`, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's payment entities
   */
  static withdrawals(playerId, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)
    return this.get(`/players/${playerId}/withdrawals?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Make a withdrawal
   */
  static cancelWithdrawal(playerId, reference, params = {}, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!reference) {
      throw new TypeError('reference missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.post(
      `/players/${playerId}/withdrawals/${reference}`,
      params,
      session
    )
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Limits
   * ======
   */

  /**
   * Fetch the player's limits
   */
  static limits(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/limits`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Set the player's limits
   */
  static setLimits(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.patch(`/players/${playerId}/limits`, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's pending limits
   */
  static confirmLimits(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.put(`/players/${playerId}/pendinglimits`, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Cancel the player's pending limits
   */
  static cancelLimits(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.delete(`/players/${playerId}/pendinglimits`, params, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Bonuses and Promotions
   * ======================
   */

  /**
   * Fetch the player's bonuses
   */
  static bonuses(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/bonuses`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Count the player's bonuses
   */
  static countBonuses(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.head(`/players/${playerId}/bonuses`, session)
      .then(response =>
        Promise.resolve({
          total: response.headers.get('X-Total-Count'),
        })
      )
      .catch(this.errorHandler)
  }

  /**
   * Fetch the bonus
   */
  static bonus(playerId, promotionCode, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!promotionCode) {
      throw new TypeError('promotionCode missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/bonuses/${promotionCode}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Activate the bonus
   */
  static activateBonus(playerId, promotionCode, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!promotionCode) {
      throw new TypeError('promotionCode missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.put(
      `/players/${playerId}/bonuses/${promotionCode}`,
      false,
      session
    )
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Cancel a currently active bonus or decline a bonus offer, based on the bonus id.
   */
  static cancelBonus(bonusId, session) {
    if (!bonusId) {
      throw new TypeError('bonusId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.delete(`/bonuses/${bonusId}`, false, session).catch(
      this.errorHandler
    )
  }

  /**
   * Fetch the promotions available on the site
   * Pass in a session to get a player's bonuses
   */
  static promotions(params = { take: 50 }, session = false) {
    const query = encodeURIObject(params)
    return this.get(`/bonuses?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Games
   * =====
   */

  /**
   * Fetch the games available on the site
   */
  static games(params = { take: 10 }) {
    const query = encodeURIObject(params)
    return this.get(`/games?${query}`)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the games available on the site
   */
  static game(gameId) {
    if (!gameId) {
      throw new TypeError('gameId missing or invalid')
    }

    return this.get(`/games/${gameId}`)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the game launch url
   */
  static gameLaunch(gameId, params = {}) {
    if (!gameId) {
      throw new TypeError('gameId missing or invalid')
    }

    return this.post(`/games/${gameId}/launch`, params)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Messages
   * ========
   */

  /**
   * Fetch the player's messages
   */
  static messages(playerId, params = { take: 20, skip: 0 }, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)

    return this.get(`/players/${playerId}/messages?${query}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Fetch the player's messages
   */
  static countMessages(playerId, params = { take: 20, skip: 0 }, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    const query = encodeURIObject(params)

    return this.head(`/players/${playerId}/messages?${query}`, session)
      .then(response =>
        Promise.resolve({
          total: response.headers.get('X-Total-Count'),
          totalUnread: response.headers.get('X-Total-Unread-Count'),
        })
      )
      .catch(this.errorHandler)
  }

  /**
   * Fetch the individual player message
   */
  static message(playerId, messageId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!messageId) {
      throw new TypeError('messageId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/messages/${messageId}`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Delete the individual message
   */
  static deleteMessage(playerId, messageId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!messageId) {
      throw new TypeError('messageId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.delete(
      `/players/${playerId}/messages/${messageId}`,
      {},
      session
    ).catch(this.errorHandler)
  }

  /**
   * Loyalty
   * =======
   */

  /**
   * Fetch the loyalty scheme and points
   */
  static points(playerId, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.get(`/players/${playerId}/loyaltyscheme`, session)
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Redeem loyalty points into a specified wallet
   */
  static redeem(playerId, params, session) {
    if (!playerId) {
      throw new TypeError('playerId missing or invalid')
    }
    if (!session) {
      throw new TypeError('session missing or invalid')
    }

    return this.post(
      `/players/${playerId}/loyaltyscheme/redeem`,
      params,
      session
    )
      .then(this.parse)
      .catch(this.errorHandler)
  }

  /**
   * Diagnostics
   * ===========
   */

  /**
   * Fetch the diagnostics information suing ping
   */
  static ping() {
    return this.get('/ping').then(this.parse)
  }

  /**
   * Request methods
   * ===============
   */

  /**
   * Generate default list of headers
   */
  static headers() {
    const headerSet = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Site-Code': this.siteCode,
      'X-Correlation-Token': uuid.v4(),
    }

    if (this.clientName) {
      headerSet['X-Spine-Client'] = this.clientName
    }

    return headerSet
  }

  /**
   * Generate authenticated list of headers
   */
  static authHeaders({ token_type, access_token }) {
    // eslint-disable-next-line
    if (!token_type) {
      throw new TypeError('token_type missing or invalid')
    }
    // eslint-disable-next-line
    if (!access_token) {
      throw new TypeError('access_token missing or invalid')
    }

    const headers = this.headers()

    // eslint-disable-next-line
    headers.Authorization = `${token_type} ${access_token}`

    return headers
  }

  /**
   * GET request
   */
  static get(route, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, null, 'GET', session)
  }

  /**
   * HEAD request
   */
  static head(route, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, null, 'HEAD', session)
  }

  /**
   * POST request
   */
  static post(route, params = false, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, params, 'POST', session)
  }

  /**
   * PUT request
   */
  static put(route, params = false, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, params, 'PUT', session)
  }

  /**
   * PATCH request
   */
  static patch(route, params = false, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, params, 'PATCH', session)
  }

  /**
   * DELETE request
   */
  static delete(route, params = {}, session = false) {
    if (!route) {
      throw new TypeError('route missing or invalid')
    }

    return this.request(route, params, 'DELETE', session)
  }

  /**
   * Set the host name of the api
   */
  static host(host) {
    this.hostName = host

    return this
  }

  /**
   * Set the site code of the site
   */
  static site(code) {
    this.siteCode = code

    return this
  }

  static client(client) {
    this.clientName = client

    return this
  }

  /**
   * Create a timeout promise
   */
  static timeout(time = 10000) {
    return new Promise((resolve, reject) => {
      setTimeout(reject, time, new Error('The request has timed out'))
    })
  }

  /**
   * Parse the response data
   */
  static parse(response) {
    const json = response.json()

    if (response.ok) {
      return json
    }

    return json.then(err => {
      throw err
    })
  }

  /**
   * Build the request body
   */
  static body(params) {
    if (params) {
      return {
        body: JSON.stringify(params),
      }
    }

    return null
  }

  /**
   * Make a request against the API using fetch
   */
  static request(route, params, method, session = false) {
    const host = this.hostName || ''
    const url = `${host}${route}`
    const headers = session ? Api.authHeaders(session) : Api.headers()
    const body = this.body(params, method)

    const options = Object.assign(
      {
        method,
        headers,
      },
      body
    )

    return this.fetch(url, options)
  }

  /**
   * Perform the fetch request, then return parsed response or timeout
   */
  static fetch(url, options) {
    const timeout = this.timeout(options.time)
    const request = fetch(url, options)

    return Promise.race([request, timeout])
  }
}

export default Api
