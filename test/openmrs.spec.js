/* eslint-disable func-names,no-var */
/* eslint-env mocha */
import chai from 'chai';
import OpenMRS from '../src/openmrs';
import chaiAsPromised from 'chai-as-promised';
import swaggerSpec from './fixtures/swagger.json';
import fauxJax from 'faux-jax';

const expect = chai.expect;
let lib;

chai.expect();
chai.use(chaiAsPromised);

describe('After contructing a new instance of OpenMRS with no constructor parameters', () => {
  before(() => {
    lib = new OpenMRS();
  });

  describe('calling the name getter', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('OpenMRS');
    });
  });

  describe('calling the version getter', () => {
    it('should return the version', () => {
      expect(lib.version).to.be.equal(require('../package.json').version);
    });
  });

  describe('accessing the API before logging in', () => {
    it('should throw an error', () => {
      expect(() => {
        lib.api // eslint-disable-line no-unused-expressions,semi
      }).to.throw(/must log in/);
    });
  });

  describe('loggin in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with correct details', () => {
      fauxJax.on('request', (req) => {
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123', 'http://localhost:8080/openmrs/module/webservices/rest/swagger.json');

      return expect(deferred).to.eventually.be.fulfilled;
    });

    it('should fail with invalid URL', () => {
      fauxJax.on('request', (req) => {
        req.respond(404, {
          'Content-Type': 'application/json',
        }, '');
      });

      const deferred = lib.login('admin', 'Admin123', 'http://junk.url');

      return expect(deferred).to.eventually.be.rejected;
    });
  });

  describe('accessing the API after logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed', () => {
      fauxJax.on('request', (req) => {
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123', 'http://localhost:8080/openmrs/module/webservices/rest/swagger.json');

      return expect(deferred
        .then(o => // eslint-disable-line no-unused-vars
          lib.api
        )).to.eventually.be.fulfilled;
    });
  });
});

describe('Contructing a new instance of OpenMRS with the full URL constructor parameter', () => {
  before(() => {
    lib = new OpenMRS('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
  });

  describe('and logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with just the user and password', () => {
      fauxJax.on('request', (req) => {
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123');

      return expect(deferred).to.eventually.be.fulfilled;
    });
  });
});

describe('Contructing a new instance of OpenMRS with the base URL and protocol', () => {
  before(() => {
    lib = new OpenMRS('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
  });

  describe('and logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with just the user and password', () => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL).to.be.equal('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123');

      return expect(deferred).to.eventually.be.fulfilled;
    });
  });
});

describe('Contructing a new instance of OpenMRS with the full URL without protocol', () => {
  before(() => {
    lib = new OpenMRS('localhost:8080/openmrs/module/webservices/rest/swagger.json');
  });

  describe('and logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with just the user and password', () => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL).to.be.equal('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123');

      return expect(deferred).to.eventually.be.fulfilled;
    });
  });
});

describe('Contructing a new instance of OpenMRS with the base URL without protocol', () => {
  before(() => {
    lib = new OpenMRS('localhost:8080/openmrs');
  });

  describe('and logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with just the user and password', () => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL).to.be.equal('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login('admin', 'Admin123');

      return expect(deferred).to.eventually.be.fulfilled;
    });
  });
});

describe('Contructing a new instance of OpenMRS with the config object', () => {
  before(() => {
    const config = {
      user: 'admin',
      pass: 'Admin123',
      url: 'localhost:8080/openmrs',
    };

    lib = new OpenMRS(config);
  });

  describe('and logging in', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should succeed with no parameters', () => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL).to.be.equal('http://localhost:8080/openmrs/module/webservices/rest/swagger.json');
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(swaggerSpec));
      });

      const deferred = lib.login();

      return expect(deferred).to.eventually.be.fulfilled;
    });
  });
});
