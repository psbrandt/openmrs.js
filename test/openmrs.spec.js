/* eslint-disable func-names,no-var */
import chai from 'chai';
import OpenMRS from '../src/openmrs';

let lib;

chai.expect();
const expect = chai.expect;

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
});
