const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async function readRss(url) {
    return await parser.parseURL(url);
};
