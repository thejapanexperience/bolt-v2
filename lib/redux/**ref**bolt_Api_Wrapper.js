import { Service, history, Translator, _ } from 'orchestra';
import Api from '@bedegaming/spine-player-client-js/src/api.js';
import { encodeURIObject } from '@bedegaming/spine-player-client-js/src/util.js';
import AuthService from 'services/auth/index.js';
import UserService from 'services/user/index.js';
import ModalService from 'utilities/modal/index.js';
import helpers from 'utilities/router/helpers.js';
import { dispatch } from 'application/store.js';
import { addFlash } from 'state/modules/flashes.js';

const apiHost = window.config.api.url;
const apiSiteCode = helpers.getSiteCode();
const clientName = 'bolt';

class ApiWrapper {
  constructor(host, siteCode, client) {
    this.serviceInstance = new Service();
    this.api = Api.host(host).site(siteCode).client(client);
    this.refreshReq = null;
    this.api.errorHandler = (e) => {
      const error = this.getTopError(e);
      const message = this.getErrorMessage(error);
      const payload = {
        message
      };
      if (error && error.error_description) {
        payload.detail = _.kebabCase(error.error_description);
      }

      return Promise.reject(payload);
    };

    this.api.loyalty = (playerId, session) => {
      this.performArgCheck(playerId, session);

      return this.api.get(`/players/${playerId}/loyalty`, session)
      .then(this.api.parse)
      .then(data => Promise.resolve(data))
      .catch(this.api.errorHandler);
    };

    this.api.transactions = (playerId, params, session) => {
      this.performArgCheck(playerId, session);

      const query = encodeURIObject(params);
      return this.api.get(`/players/${playerId}/transactions?${query}`, session)
      .then(this.api.parse)
      .then(data => Promise.resolve(data))
      .catch(this.api.errorHandler);
    };

    this.api.declineBonus = (playerId, promotionCode, actionData, session) => {
      this.performArgCheck(playerId, session);

      return this.api.delete(`/players/${playerId}/bonuses/${promotionCode}`, actionData, session)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };

    this.api.updatePassword = (playerId, username, credentials, session) => {
      this.performArgCheck(playerId, session);

      return this.api.patch(`/players/${playerId}/identities/${username}`, credentials, session)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };

    this.api.requestPassword = (username) => {
      const payload = { purpose: 'resetPassword' };
      this.performArgCheck(username);

      return this.api.post(`/players/identities/${username}/tokens`, payload)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };

    this.api.bankingSummary = (playerId, session) => {
      this.performArgCheck(playerId, session);

      return this.api.get(`/players/${playerId}/banking/summary`, session)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };

    this.api.resetPassword = (username, payload) =>
      this.api.put(`/players/identities/${username}`, payload)
      .then(this.api.parse)
      .catch(this.api.errorHandler);

    this.api.updateAccountStatus = (playerId, payload, session) => {
      this.performArgCheck(playerId, session);

      return this.api.put(`/players/${playerId}/accountstatus`, payload, session)
      .then(this.api.parse)
      .catch(this.api.errorHandler);
    };

    this.api.parse = (response) => {
      const { status, statusText } = response;
      if (status === 204 && (!statusText.length || statusText === 'No Content' || statusText.includes('204'))) {
        return Promise.resolve();
      }

      const json = response.json();

      if (response.ok) {
        return json;
      }

      return json.then(err => {
        throw err;
      });
    };

    this.api.fetch = (url, options) =>
      window.fetch(url, options)
      .then(res => {
        const { status } = res;

        if (status >= 200 && status < 300) {
          return Promise.resolve(res);
        }

        if (status === 404) {
          return this.get404Errors(res)
          .then((err) => Promise.reject(err));
        }

        if (status === 401) {
          return res.json()
          .then(errors => {
            if (errors && errors.errors.length && errors.errors[0].code === 'account-blacklisted') {
              return Promise.reject(errors);
            }

            return Promise.reject({ errors: [{ code: 'not_authorized', status: 401 }] });
          });
        }

        return res.json()
        .then(errors => Promise.reject(errors));
      })
      .catch(e => Promise.reject(e));

    this.api.countActivities = (playerId, params, session) => {
      this.performArgCheck(playerId, session);

      const query = encodeURIObject(params);
      return this.api.head(`/players/${playerId}/activities?${query}`, session)
        .then(response => {
          const currentPage = params.skip === 0 ? 1 : parseInt(params.skip / params.take + 1, 10);
          const totalItems = response.headers.get('X-Total-Items');
          const totalPages = response.headers.get('X-Total-Pages');
          const itemsPerPage = response.headers.get('X-Items-Per-Page');

          return Promise.resolve({
            currentPage,
            totalItems: totalItems ? parseInt(totalItems, 10) : 0,
            totalPages: totalPages ? parseInt(totalPages, 10) : 0,
            pageSize: itemsPerPage ? parseInt(itemsPerPage, 10) : 0
          });
        })
        .catch(this.api.errorHandler);
    };

    this.api.activateBonus = (playerId, promotionCode, params = false, session) => {
      this.performArgCheck(playerId, session);

      return this.api.put(`/players/${playerId}/bonuses/${promotionCode}`, params, session)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };

    this.api.bonuses = (playerId, params, session) => {
      this.performArgCheck(playerId, session);

      const query = encodeURIObject(params);

      return this.api.get(`/players/${playerId}/bonuses?${query}`, session)
        .then(this.api.parse)
        .catch(this.api.errorHandler);
    };
  }

  get404Errors(response) {
    return new Promise(resolve => {
      response.json()
      .then(errors => resolve(errors))
      .catch(() => resolve({ errors: [{ code: 'not_found', status: 404 }] }));
    });
  }

  getTopError(e) {
    if (e.errors && e.errors.length) {
      return e.errors[0];
    } else if (e.status) {
      return e;
    }

    return null;
  }

  getErrorMessage(error) {
    if (error && error.status) {
      const status = parseInt(error.status, 10);

      if (error.error !== 'bad_request' && status !== 500 && status !== 503) {
        return this.getErrorKey(error);
      }
    }

    return 'request_error';
  }

  getErrorKey(error) {
    if (error.code && error.code.length) {
      return error.code.replace(/-/g, '_');
    }

    if (error.error) {
      return error.error;
    }

    if (error.status === 404) {
      return 'not_found';
    }

    return 'request_error';
  }

  performArgCheck(...args) {
    const requestError = Translator.translate('request_error');
    const missingArgs = args.filter(arg => arg === undefined).length;

    if (missingArgs) {
      throw new TypeError(requestError);
    }
  }

  delayedRetry(data, retry, resolve, reject) {
    const delay = 1000;
    window.setTimeout(() => {
      this.wrapReq(data, retry, resolve, reject);
    }, delay);
  }

  getReq(data) {
    if (this.refreshReq) {
      if (data.apiMethodName !== 'refresh') {
        return this.refreshReq
        .then(() => {
          this.refreshReq = null;
          return this.api[data.apiMethodName].apply(this.api, data.params);
        })
        .catch(e => {
          this.refreshReq = null;
          return Promise.reject(e);
        });
      }

      return this.getRefreshRequestResult();
    }

    if (data.apiMethodName === 'refresh') {
      this.refreshReq = this.api.refresh.apply(this.api, data.params);

      return this.getRefreshRequestResult();
    }

    return this.api[data.apiMethodName].apply(this.api, data.params);
  }

  getRefreshRequestResult() {
    return this.refreshReq
    .then(res => {
      this.refreshReq = null;
      return Promise.resolve(res);
    })
    .catch(e => {
      this.refreshReq = null;
      AuthService.evict();
      return Promise.reject(e);
    });
  }

  wrapReq(data, retry, resolve, reject) {
    const { retries } = retry;

    return this.getReq(data)
    .then(res => resolve(res))
    .catch(err => {
      if (err.message === 'NotAuthorized' || err.message === 'not_authorized') {
        if (retries > 0) {
          AuthService.request('refresh')
          .then(() => {
            const refreshedData = data;
            /* eslint-disable camelcase */
            const { access_token, refresh_token } = AuthService.getSession() || {};
            if (access_token && refresh_token) {
              const lastIndex = refreshedData.params.length - 1;
              refreshedData.params[lastIndex].access_token = access_token;
              refreshedData.params[lastIndex].refresh_token = refresh_token;
            }
            /* eslint-enable camelcase */

            const updatedRetry = {
              retries: retries - 1
            };

            return this.delayedRetry(refreshedData, updatedRetry, resolve, reject);
          })
          .catch(e => {
            this.logout();
            reject(e);
          });
        } else {
          this.logout();
          reject(err);
        }
      } else {
        if (err && err.message && err.detail === 'authentication-failed') {
          this.logout();
        }
        reject(err);
      }
    });
  }

  request(apiMethodName, ...params) {
    const retry = {
      retries: 2
    };

    return new Promise((resolve, reject) => {
      const data = { apiMethodName, params };
      this.wrapReq(data, retry, resolve, reject);
    });
  }

  hideLogin() {
    this.isLoginVisible = false;
  }

  logout(fromAuth = false) {
    if (this.isLoginVisible) {
      return false;
    }

    this.serviceInstance.listenTo(ModalService, 'close', this.hideLogin);
    if (fromAuth) {
      return UserService.request('showLogin');
    }
    return UserService.request('logout', false)
    .then(() => {
      const isolated = window.config.features.isolatedRoutes;
      const isolatedLogin = isolated && isolated.login;

      if (!isolatedLogin) {
        history.navigate('/', { trigger: true });
      }

      UserService.request('showLogin');
      this.isLoginVisible = true;

      dispatch(addFlash({
        type: 'error',
        title: 'error',
        body: 'inactivity_message',
        timeout: 5000
      }));
    });
  }
}

export default new ApiWrapper(apiHost, apiSiteCode, clientName);
