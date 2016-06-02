var REFAPP_OPENMRS_ID_CHARS = '0123456789ACDEFGHJKLMNPRTUVWXY'; // allowed OpenMRS ID characters

var o;
var chance = Chance();

// copied from https://github.com/mikeymckay/luhn-mod-n
var generateCheckCharacter = function(input, possibleCharacters) {

    var factor = 2;
    var sum = 0;
    var n = possibleCharacters.length;

    // Starting from the right and working leftwards is easier since
    // the initial "factor" will always be "2"
    for (var i = input.length - 1; i >= 0; i--) {
            var codePoint = possibleCharacters.indexOf(input.charAt(i));
            var addend = factor * codePoint;

            // Alternate the "factor" that each "codePoint" is multiplied by
            factor = (factor == 2) ? 1 : 2;

            // Sum the digits of the "addend" as expressed in base "n"
            addend = Math.floor(addend / n) + (addend % n);
            sum += addend;
    }

    // Calculate the number that must be added to the "sum"
    // to make it divisible by "n"
    var remainder = sum % n;
    var checkCodePoint = (n - remainder) % n;

    return possibleCharacters.charAt(checkCodePoint);
}

var animateSVGPath = function(pathSelector) {
    var path = document.querySelector(pathSelector);
    var pathLength = path.getTotalLength();
    path.setAttribute("stroke-dasharray", path.getTotalLength());

    animate({
        el: path,
        duration: 2000,
        easing: "linear",
        "stroke-dashoffset": [pathLength, 0],
        complete: function() {
            path.removeAttribute("stroke-dasharray");
        }
    });

    animate({
        el: pathSelector,
        duration: 1500,
        easing: "linear",
        "opacity": [0, 1]
    });
}

var animateLogo = function() {
    animateSVGPath("#top");
    animateSVGPath("#bottom");
    animateSVGPath("#left");
    animateSVGPath("#right");

    setTimeout(function() {
        animate({
            el: document.querySelector("#text"),
            duration: 2000,
            easing: "linear",
            "opacity": [0, 0.676]
        });
    }, 2000);
}

var init = function() {
    // animate logo
    animateLogo();

    // initializa scrollspy
    $(document).ready(function() {
        $('.scrollspy').scrollSpy();
    });

    // initialize openmrs.js
    o = new OpenMRS();
    o.login('admin', 'Admin123', 'https://openmrs.psbrandt.io/openmrs');

    // set up code
    initCodeBlocks();
}

var format = function(code) {
    return js_beautify(code, { indent_size: 2 });
}

var initCodeBlocks = function() {
    // basic login
    $('#login-basic').html(format("\/\/ instantiate OpenMRS \n\
const o = new OpenMRS(); \n\
\/\/ log in \n\
o.login('admin', 'Admin123', 'https://openmrs.psbrandt.io/openmrs');"));

    // config login
    $('#login-config').html(format("const config = { \
user: 'admin', \
pass: 'Admin123', \
url: 'https://openmrs.psbrandt.io/openmrs', \
}; \n\
// instantiate OpenMRS \n \
const o = new OpenMRS(config); \n\
// log in \n\
const deferred = o.login();"));

    // create patient
    var gen = chance.gender();
    var omrsId = chance.string({
        pool: REFAPP_OPENMRS_ID_CHARS,
      });
    $('#create-patient').html(format('const patient = {\
  "person": {\
    "names": [{\
      "givenName": "' + chance.first({ gender: gen }) + '",\
      "familyName": "' + chance.last({ gender: gen }) + '",\
  }],\
    "gender": "' + gen.charAt(0) + '",\
},\
  "identifiers": [{\
    "identifierType": "05a29f94-c0ed-11e2-94be-8c13b969e334", // OpenMRS ID\n\
    "identifier": "' + omrsId + generateCheckCharacter(omrsId, REFAPP_OPENMRS_ID_CHARS) + '",                      // valid Luhn mod 30 check digit\n\
    "location": "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",       // Default Location\n\
}]\
};\
\n\n\
o.api.patient.createPatient({\
  resource: patient,\
}).then(() => {\n\
  // do more stuff\n\
}).catch((err) => {\
  console.log(err);\
});'));

// create patient more
var gen = chance.gender();
var omrsId = chance.string({
    pool: REFAPP_OPENMRS_ID_CHARS,
  });
var bday = chance.birthday();
$('#create-patient-more').html(format('const patient = {\
  "person": {\
    "names": [{\
      "givenName": "' + chance.first({ gender: gen }) + '",\
      "familyName": "' + chance.last({ gender: gen }) + '",\
  }],\
    "gender": "' + gen.charAt(0) + '",\
    "birthdate": "'+bday.getFullYear()+ '-' + (bday.getMonth() + 1) + '-'+ bday.getDate() +'",\
    "addresses": [{\
      "preferred": true,\
      "address1": "'+chance.address()+'",\
      "cityVillage": "'+chance.city()+'",\
      "stateProvince": "'+chance.province()+'",\
      "country": "'+chance.country({
          full: true,
        })+'",\
      "postalCode": "'+chance.zip()+'",\
  }],\
    "attributes": [{\
      "attributeType": {\
        "uuid": "14d4f066-15f5-102d-96e4-000c29c2a5d7",       // Phone Number\n\
    },\
      "value": "'+chance.phone()+'",\
  }]\
  },\
  "identifiers": [{\
    "identifierType": "05a29f94-c0ed-11e2-94be-8c13b969e334", // OpenMRS ID\n\
    "identifier": "' + omrsId + generateCheckCharacter(omrsId, REFAPP_OPENMRS_ID_CHARS) + '",                      // valid Luhn mod 30 check digit\n\
    "location": "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",       // Default Location\n\
}]\
};\
\n\n\
o.api.patient.createPatient({\
  resource: patient,\
}).then(() => {\n\
  // do more stuff\n\
}).catch((err) => {\
  console.log(err);\
});'));

}

$(init);
