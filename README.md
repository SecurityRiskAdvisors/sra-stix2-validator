# sra-stix2-validator
stix2 schema validation for Node JS

call .validate -> get back null if no errors or list of ajv errors if there's an issue

Just JSON schema validation for now

**Note**: The JSON schemas are not valid as they are.  They are patched at runtime to make them valid.  This isn't ideal, and the code for doing this this is not something to be proud of.  However, I wanted to manipulate the actual schema files as little as possible from the stix2 json schema project aside from converting them from draft04 to draft06 spec.  
