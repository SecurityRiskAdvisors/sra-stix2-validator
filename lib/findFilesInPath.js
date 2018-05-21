const fs = require('fs');
const path = require('path');

const findFilesInPath = (dir, extFilter = null) =>
    fs.readdirSync(dir).reduce((fileMap, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        if(isDirectory) {
            return Object.assign(fileMap, findFilesInPath(name, extFilter));
        } 
        if(!extFilter || path.extname(file) == extFilter) {
            let schemaKey = path.basename(file, path.extname(file));
            return Object.assign({ [schemaKey] : name }, fileMap);
        }
        return fileMap;
   }, {});

module.exports = {
   findFilesInPath : findFilesInPath
}
