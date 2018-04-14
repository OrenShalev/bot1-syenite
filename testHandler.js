const {readJson, writeJson} = require(`./dataService`);
const readRss = require(`./rssReader`);
// const {postTweet} = require(`./twitterService`);

const dataFilename = `.data/data.json`;

module.exports = async function testHandler(req, res) {
    try {
        /*
        Read some data
        Read RSS
        Decide if to tweet
        Tweet
        Save data
        */

        const data = readJson(dataFilename);
        if (!data.tweetedLinks) {
            data.tweetedLinks = {};
        }
        const tweetedLinks = data.tweetedLinks;
        const feed = await readRss(`http://rss.walla.co.il/feed/6?type=main`);
        // const feed = await readRss(`http://localhost:3000/.mock-data/mock-feed.xml`);
        const firstItem = feed.items[0];

        // big-ass logic here to take a decision
        const tweeted = isItemTweeted(tweetedLinks, firstItem.link);

        if (!tweeted) { // then build a string from item
            const status = `${firstItem.title} \n${firstItem.link}`;
            // postTweet(status);
            markItemAsTweeted(tweetedLinks, firstItem.link);
            writeJson(dataFilename, data);

            res.status(200).send(`Tweeted`);
        } else {
            res.status(200).send(`Not tweeted`);
        }
    } catch (e) {
        res.status(500).send(e.stack);
    }
};

function isItemTweeted(tweetedLinks, itemLink) {
    return tweetedLinks[itemLink] === true;
}
function markItemAsTweeted(tweetedLinks, itemLink) {
    tweetedLinks[itemLink] = true;
}