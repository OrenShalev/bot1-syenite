const fs = require(`fs`);

function readJson(file) {
    return JSON.parse(fs.readFileSync(file));
}
function writeJson(file, json) {
    fs.writeFileSync(file, JSON.stringify(json, ' ', 4), { encoding: `utf8` });
}

module.exports = { readJson, writeJson };
