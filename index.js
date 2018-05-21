'use strict'

const Ajv = require('ajv');
const ff = require('./lib/findFilesInPath');
const dmp = require('./lib/doubleMonkeyPatchSchema');
const path = require('path');

let ajv = new Ajv({});
let schemaConfigured = false;
let keyRef = {};

const configureSchema = () => {
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        
    let files = ff.findFilesInPath(__dirname + path.sep + 'schemas', '.json');
    for(let key in files) {
        let fixedSchema = dmp.doubleMonkeyPatchSchema(require(files[key]));
        keyRef[key] = fixedSchema['$id'];
        ajv.addSchema(fixedSchema, fixedSchema['$id']);
    }
    schemaConfigured = true;
}
    
const validate = (stix2data) => {
    if(!schemaConfigured) {
        configureSchema();
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
