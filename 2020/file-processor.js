const fs = require('fs');

// file processing
module.exports = function processFile(file, separators = {
    lineSeparator: new RegExp("\n", 'g'),
    groupSeparator,
    jsonSeparator,
}) {
    const rawText = fs.readFileSync(file, 'utf8');
    const toJSON = (json, keyValues) => {
        json[keyValues[0]] = keyValues[1];
        return json;
    };

    const parsedJson = rawText
        .split(separators.lineSeparator)
        .map(line => separators.groupSeparator ? line.split(separators.groupSeparator) : line)
        .map(line => !(separators.jsonSeparator && Array.isArray(line)) ? line : line.reduce(toJSON, {}));

    return (separators.jsonSeparator && !separators.groupSeparator) ? parsedJson.reduce(toJSON, {}) : parsedJson;

        // .map(line => {
        //     let mapping = separators.groupSeparator ? line.split(separators.groupSeparator) : line;

        //     if (separators.jsonSeparator) {
        //         const jsonMapping = {};
        //         if (Array.isArray(mapping)) {
        //             mapping.forEach(keyValues => {
        //                 const keyValue = keyValues.split(separators.jsonSeparator);
        //                 jsonMapping[keyValue[0]] = keyValue[1];
        //             });
        //         } else {
        //             mapping = mapping.split(separators.jsonSeparator);
        //             jsonMapping[mapping[0]] = mapping[1];
        //         }
        //         return jsonMapping;
        //     }

        //     return mapping;
        // });

    // return parsedJson;
}


// function processFilePartI(file) {
//     let rawText = fs.readFileSync(file, 'utf8');
//     const passportSeparator = new RegExp("\n\n", 'g');
//     const keyValueSeparator = new RegExp("[\s]|[\n]|[\t]|[ ]", 'g');
//     const keyToValueSeparator = new RegExp(":", 'g');

//     const parsedJson = rawText
//         .split(passportSeparator)
//         .map(passport => passport.split(keyValueSeparator))
//         .map(passport => {
//             const passportJSON = {};
//             passport.map(keyValues => {
//                 keyValue = keyValues.split(keyToValueSeparator);
//                 passportJSON[keyValue[0]] = keyValue[1];
//             });
//             return passportJSON;
//         });
//     return parsedJson
// }