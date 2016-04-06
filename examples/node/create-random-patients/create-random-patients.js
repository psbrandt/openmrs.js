'use strict';

const yargs = require('yargs');
const Chance = require('chance')();
const OpenMRS = require('openmrs.js');
const luhnModN = require('luhn-mod-n');
const ProgressBar = require('progress');

const REFAPP_OPENMRS_ID_UUID = '05a29f94-c0ed-11e2-94be-8c13b969e334'; // required ID type
const REFAPP_OPENMRS_ID_CHARS = '0123456789ACDEFGHJKLMNPRTUVWXY'; // allowed OpenMRS ID characters
const REFAPP_UNKNOWN_LOCATION_UUID = '8d6c993e-c2cc-11de-8d13-0010c6dffd0f'; // default location
const REFAPP_TEL_PERSON_ATTR_UUID = '14d4f066-15f5-102d-96e4-000c29c2a5d7'; // Tel attribute

const createPatients = (args) => {
  const o = new OpenMRS(args.h || args.host);
  const deferred = o.login(args.u || args.user, args.p || args.pass);
  const numPatients = args.n || args.number;
  const bar = new ProgressBar('  creating patients [:bar] :percent', {
    complete: '=',
    incomplete: ' ',
    width: 80,
    total: numPatients,
    callback: () => {
      console.log(); // eslint-disable-line no-console
    },
  });

  deferred.then(() => {
    console.log(); // eslint-disable-line no-console
    for (let i = 0; i < numPatients; i++) {
      const gender = Chance.gender();
      const omrsId = Chance.string({
        pool: REFAPP_OPENMRS_ID_CHARS,
      });
      const bday = Chance.birthday();

      // basic demographics
      const person = {
        names: [{
          givenName: Chance.first({
            gender,
          }),
          familyName: Chance.last({
            gender,
          }),
        }],
        gender: gender.charAt(0),
        birthdate: `${bday.getFullYear()}-${bday.getMonth() + 1}-${bday.getDate()}`,
      };

      // address
      person.addresses = [{
        preferred: true,
        address1: Chance.address(),
        cityVillage: Chance.city(),
        stateProvince: Chance.province(),
        country: Chance.country({
          full: true,
        }),
        postalCode: Chance.zip(),
      }];

      // phone number
      person.attributes = [{
        attributeType: {
          uuid: REFAPP_TEL_PERSON_ATTR_UUID,
        },
        value: Chance.phone(),
      }];

      // patient identifiers (Luhn Mod 30)
      const identifiers = [{
        identifierType: REFAPP_OPENMRS_ID_UUID,
        identifier: `${omrsId}${luhnModN.generateCheckCharacter(omrsId, REFAPP_OPENMRS_ID_CHARS)}`,
        location: REFAPP_UNKNOWN_LOCATION_UUID,
      }];

      // compose patient
      const patient = {
        person,
        identifiers,
      };

      o.api.patient.createPatient({
        resource: patient,
      }).then(() => {
        bar.tick();
      }).catch((err) => {
        console.log(err); // eslint-disable-line no-console
      });
    }
  }).catch((err) => {
    console.log(err); // eslint-disable-line no-console
  });
};

// set up arguments
const args = yargs.usage('$0 [args]') // eslint-disable-line no-unused-expressions
  .option('n', {
    alias: 'number',
    describe: 'Number of patients to create',
    demand: true,
  })
  .option('u', {
    alias: 'user',
    describe: 'OpenMRS username',
    demand: true,
  })
  .option('p', {
    alias: 'pass',
    describe: 'OpenMRS password',
    demand: true,
  })
  .option('h', {
    alias: 'host',
    describe: 'OpenMRS application URL',
    demand: true,
  })
  .example('$0 -n 5 -u admin -p Admin123 -h http://localhost:8080/openmrs', 'Create 5 patients')
  .help('help').argv;

createPatients(args);
