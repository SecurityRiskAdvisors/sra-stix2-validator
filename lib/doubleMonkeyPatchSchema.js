/* 
    The default STIX JSON validators don't work as they sit.  
    The test_examples.sh file doesn't validate, its refs fail. 
    schema refs in STIX2 JSON schemas are relative paths without file:// indicator
    which are then mutated at runtime in a completely different Python project
    This wasn't documented as far as I could tell which made for an interesting investigation
*/

// called with every property and its value
// does weird things to $id and $refs to make everyone sad
// eventually we could include paths if there are dupes - gotta watch refs though based on relative local dir
const dmpRefsAndIds = (key,value) => {
    if((key == "$id" || key == "$ref") 
        && value.charAt(0) != '#') {
            let match = value.match(/[A-Za-z0-9\-]+\.json$/m);
            return match[0];
    }

    return value;
}

const isArray = (o) => {
    return Object.prototype.toString.call(o) === '[object Array]'
}

const isObj = (o) => {
    return (o !== null && typeof(o)=="object")
}

const traverseManipulate = (o,iteratorTracker,func) => {
    let newObj = o;

    if(isObj(newObj)) {
        for (var i in newObj) {
            newObj[i] = traverseManipulate(newObj[i], i, func);
        }
    } else if(isArray(newObj)) {
        let l = newObj.length;
        for(let i = 0; i < l; i++) {
            newObj[i] = traverseManipulate(newObj[i], i, func);
        }
    } else {
        if(iteratorTracker == null) {
            throw new Error('dev error, traversing nontraversable data');
        }
        newObj = func.apply(this,[iteratorTracker,newObj]); 
    }

    return newObj;
}

const doubleMonkeyPatchSchema = (schema) => {
    return traverseManipulate(schema,null,dmpRefsAndIds);
}

module.exports = {
    doubleMonkeyPatchSchema : doubleMonkeyPatchSchema
}