const fs = require('fs');

// file processing
module.exports = function processFile(file, separators = {
    lineSeparator,
    groupSeparator,
    jsonSeparator,
    mapSeparator,
    rawText: false
}) {
    const rawText = fs.readFileSync(file, 'utf8');

    if (separators.rawText) return rawText;
    if (separators.jsonSeparator && separators.mapSeparator) throw 'You cannot use both json and map separators';

    const toJSON = (json, keyValues) => {
        const keyValue = keyValues.split(separators.jsonSeparator);
        json[keyValue[0]] = keyValue[1];
        return json;
    };

    const toMap = (map, keyValues) => {
        const keyValue = keyValues.split(separators.mapSeparator);
        map.set(keyValue[0], keyValue[1]);
        return map;
    };

    const parsedJson = rawText
        .split(separators.lineSeparator)
        .map(line => separators.groupSeparator ? line.split(separators.groupSeparator) : line)
        .map(line => !(separators.jsonSeparator && Array.isArray(line)) ? line : line.reduce(toJSON, {}))
        .map(line => !(separators.mapSeparator && Array.isArray(line)) ? line : line.reduce(toMap, new Map()));

    return (separators.jsonSeparator && !separators.groupSeparator) 
        ? parsedJson.reduce(toJSON, {}) 
        : (separators.mapSeparator && !separators.groupSeparator) 
            ? parsedJson.reduce(toMap, new Map())
            : parsedJson;
}