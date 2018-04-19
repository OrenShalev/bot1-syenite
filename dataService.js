const fs = require(`fs`);

const dataFile = `.data/data.json`;
let data = {};

module.exports = { load, save, isItemTweeted, markItemAsTweeted };

function load() {
    data = readJson(dataFile);
}
function save() {
    writeJson(dataFile, data);
}

function isItemTweeted(itemLink) {
    data.tweetedLinks = data.tweetedLinks || {};
    return data.tweetedLinks.hasOwnProperty(itemLink);
}
function markItemAsTweeted(itemLink) {
    data.tweetedLinks = data.tweetedLinks || {};
    data.tweetedLinks[itemLink] = new Date();
}

function readJson(filename) {
    return JSON.parse(fs.readFileSync(filename));
}
function writeJson(filename, json) {
    fs.writeFileSync(filename, JSON.stringify(json, ' ', 4), { encoding: `utf8` });
}
