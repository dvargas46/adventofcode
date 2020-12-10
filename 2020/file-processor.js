const fs = require('fs');

// file processing
module.exports = function processFile(file, separators = {
    lineSeparator,
    groupSeparator,
    jsonSeparator,
}) {
    const rawText = fs.readFileSync(file, 'utf8');
    const toJSON = (json, keyValues) => {
        const keyValue = keyValues.split(separators.jsonSeparator);
        json[keyValue[0]] = keyValue[1];
        return json;
    };

    const parsedJson = rawText
        .split(separators.lineSeparator)
        .map(line => separators.groupSeparator ? line.split(separators.groupSeparator) : line)
        .map(line => !(separators.jsonSeparator && Array.isArray(line)) ? line : line.reduce(toJSON, {}));

    return (separators.jsonSeparator && !separators.groupSeparator) ? parsedJson.reduce(toJSON, {}) : parsedJson;
}