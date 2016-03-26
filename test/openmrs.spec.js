/* eslint-disable func-names,no-var */
import chai from 'chai';
import nock from 'nock';
import OpenMRS from '../src/openmrs';
import chaiAsPromised from 'chai-as-promised';
import swaggerSpec from './fixtures/swagger.json';

const expect = chai.expect;
let lib;

chai.expect();
chai.use(chaiAsPromised);

describe('After contructing a new instance of OpenMRS', () => {
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
    it('should succeed with correct details', () => {
      nock('http://localhost:8080/openmrs')
        .get('/module/webservices/rest/swagger.json')
        .reply(200, JSON.stringify(swaggerSpec));

      return expect(lib.login('admin', 'Admin123', 'http://localhost:8080/openmrs/module/webservices/rest/swagger.json')).to.eventually.be.fulfilled;
    });

    it('should fail with invalid URL', () =>
      expect(lib.login('admin', 'Admin123', 'http://junk.url')).to.eventually.be.rejected
    );
  });

  describe('accessing the API after logging in', () => {
    it('should succeed', () => {
      nock('http://localhost:8080/openmrs')
        .get('/module/webservices/rest/swagger.json')
        .reply(200, JSON.stringify(swaggerSpec));

      return expect(lib.login('admin', 'Admin123', 'http://localhost:8080/openmrs/module/webservices/rest/swagger.json')
        .then(o => // eslint-disable-line no-unused-vars
          lib.api
        )).to.eventually.be.fulfilled;
    });
  });
});
