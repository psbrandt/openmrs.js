import Swagger from 'swagger-client';
import * as constants from './constants';

export default class OpenMRS {

  constructor(config) {
    /** Allow configuration to to be initialized on new instance creation */
    if (typeof config === 'object') {
      this.config = config;
    } else if (typeof config === 'string') {
      this.config = {
        url: config,
      };
    } else {
      this.config = {};
    }

    /** Used as the library name. */
    this._name = constants.OMRSJS_CLASS_NAME;

    /** Used as the semantic version number. */
    this._version = constants.OMRSJS_VERSION;

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

  getOpenAPISpecURL(url) {
    let specUrl = url;

    // make sure a protocol is specified
    if (url.substring(0, 4) !== constants.OMRSJS_DEFAULT_PROTOCOL) {
      specUrl = `${constants.OMRSJS_DEFAULT_PROTOCOL}://${specUrl}`;
    }

    // make sure the url string points to the OpenAPI spec
    if (url.endsWith(constants.OMRSJS_OPENAPI_SPEC_PATH_SUFFIX)) {
      /** noop */
    } else {
      specUrl = url.endsWith('/') ? `${specUrl}${constants.OMRSJS_OPENAPI_SPEC_PATH_SUFFIX}` :
        `${specUrl}/${constants.OMRSJS_OPENAPI_SPEC_PATH_SUFFIX}`;
    }

    return specUrl;
  }

  login(user = this.config.user, pass = this.config.pass, url = this.config.url) {
    return new Swagger({
      url: this.getOpenAPISpecURL(url),
      usePromise: true,
      authorizations: {
        easyapi_basic: new Swagger.PasswordAuthorization(user, pass),
      },
    }).then((client) =>
      this.wireAPI(client)
    );
  }
}
