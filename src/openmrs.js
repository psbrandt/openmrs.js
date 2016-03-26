import Swagger from 'swagger-client';

export default class OpenMRS {

  constructor(config) {
    /** Allow configuration to to be initialized on new instance creation */
    this.config = config || {};

    /** Used as the library name. */
    this._name = 'OpenMRS';

    /** Used as the semantic version number. */
    this._version = '0.0.1';

    this._api = undefined;
  }

  get name() {
    return this._name;
  }

  get version() {
    return this._version;
  }

  wireAPI(api) {
    this._api = api;
  }

  get api() {
    if (this._api === undefined) {
      throw new Error('You must log in before accessing the API.');
    } else {
      return this._api;
    }
  }

  login(user = this.config.user, pass = this.config.pass, url = this.config.url) {
    return new Swagger({
      url,
      usePromise: true,
      authorizations: {
        easyapi_basic: new Swagger.PasswordAuthorization(user, pass),
      },
    }).then((client) =>
      this.wireAPI(client)
    );
  }
}
