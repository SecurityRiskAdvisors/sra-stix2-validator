'use strict'

const Ajv = require('ajv');
const ff = require('./lib/findFilesInPath');
const dmp = require('./lib/doubleMonkeyPatchSchema');
const path = require('path');

const validate = (stix2data) => {
    var ajv = new Ajv({});
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        
    let files = ff.findFilesInPath(__dirname + path.sep + 'schemas', '.json');

    let keyRef = {};
    for(let key in files) {
        let fixedSchema = dmp.doubleMonkeyPatchSchema(require(files[key]));
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


const testCoa = {
    "name": "LSASS Driver Mitigation",
    "description": "On Windows 8.1 and Server 2012 R2, enable LSA Protection by setting the Registry key <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL</code> to <code>dword:00000001</code>. (Citation: Microsoft LSA Protection Mar 2014) LSA Protection ensures that LSA plug-ins and drivers are only loaded if they are digitally signed with a Microsoft signature and adhere to the Microsoft Security Development Lifecycle (SDL) process guidance.\n\nOn Windows 10 and Server 2016, enable Windows Defender Credential Guard (Citation: Microsoft Enable Cred Guard April 2017) to run lsass.exe in an isolated virtualized environment without any device drivers. (Citation: Microsoft Credential Guard April 2017)\n\nEnsure safe DLL search mode is enabled <code>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\SafeDllSearchMode</code> to mitigate risk that lsass.exe loads a malicious code library. (Citation: Microsoft DLL Security)",
    "external_references": [
        {
            "url": "https://attack.mitre.org/wiki/Technique/T1177",
            "source_name": "mitre-attack",
            "external_id": "T1177"
        },
        {
            "description": "Microsoft. (2014, March 12). Configuring Additional LSA Protection. Retrieved November 27, 2017.",
            "source_name": "Microsoft LSA Protection Mar 2014",
            "url": "https://technet.microsoft.com/library/dn408187.aspx"
        },
        {
            "description": "Lich, B., Tobin, J., Hall, J. (2017, April 5). Manage Windows Defender Credential Guard. Retrieved November 27, 2017.",
            "source_name": "Microsoft Enable Cred Guard April 2017",
            "url": "https://docs.microsoft.com/windows/access-protection/credential-guard/credential-guard-manage"
        },
        {
            "description": "Lich, B., Tobin, J. (2017, April 5). How Windows Defender Credential Guard works. Retrieved November 27, 2017.",
            "source_name": "Microsoft Credential Guard April 2017",
            "url": "https://docs.microsoft.com/windows/access-protection/credential-guard/credential-guard-how-it-works"
        },
        {
            "description": "Microsoft. (n.d.). Dynamic-Link Library Security. Retrieved November 27, 2017.",
            "source_name": "Microsoft DLL Security",
            "url": "https://msdn.microsoft.com/library/windows/desktop/ff919712.aspx"
        }
    ],
    "created_by_ref": "identity--c78cb6e5-0c4b-4611-8297-d1b8b55e40b5",
    "id": "course-of-action--7a6e5ca3-562f-4185-a323-f3b62b5b2e6b",
    "created": "2018-04-18T17:59:24.739Z",
    "modified": "2018-04-18T17:59:24.739Z",
    "type": "course-of-action"
};

validate(testCoa)