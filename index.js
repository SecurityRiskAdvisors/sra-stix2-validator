'use strict'

const Ajv = require('ajv');
const ff = require('./lib/findFilesInPath');
const dmp = require('./lib/doubleMonkeyPatchSchema');

const validate = (stix2data) => {
    var ajv = new Ajv({});
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        
    let files = ff.findFilesInPath('./schemas', '.json');

    let keyRef = {};
    for(let key in files) {
        let fixedSchema = dmp.doubleMonkeyPatchSchema(require('./' + files[key]));
        keyRef[key] = fixedSchema['$id'];
        ajv.addSchema(fixedSchema, fixedSchema['$id']);
    }

    var valid = ajv.validate(keyRef[stix2data.type], stix2data);
    if (!valid) {
        return ajv.errors;
    } 
    return null;
}

module.exports = {
    validate: validate
}