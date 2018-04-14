const fs = require(`fs`);

function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename));
}
function writeJson(filename, json) {
    fs.writeFileSync(filename, JSON.stringify(json, ' ', 4), { encoding: `utf8` });
}

module.exports = { readJson, writeJson };
