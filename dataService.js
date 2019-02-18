const fs = require(`fs`);

const dataFile = `.data/data.json`;
let data = {};

module.exports = { get, set, load, save, isItemTweeted, isItemTweetedByKey, markItemAsTweeted, markItemAsTweetedByKey };

function get() { return data; }
function set(dataaa) { data = dataaa; }

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

// Fix for irrelevant/blogim
function isItemTweetedByKey(itemLink, key) {
    data.tweetedLinks = data.tweetedLinks || {};
    data.tweetedLinks[key] = data.tweetedLinks[key] || {};
    return data.tweetedLinks[key].hasOwnProperty(itemLink);
}
function markItemAsTweetedByKey(itemLink, key) {
    data.tweetedLinks = data.tweetedLinks || {};
    data.tweetedLinks[key] = data.tweetedLinks[key] || {};
    data.tweetedLinks[key][itemLink] = new Date();
}

