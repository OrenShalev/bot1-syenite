const {readJson, writeJson} = require(`./dataService`);
const readRss = require(`./rssReader`);
const {postTweet} = require(`./twitterService`);

module.exports = async function testHandler(req, res) {
    try {
        /*
        Read some data
        Read RSS
        Decide if to tweet
        Tweet
        Save data
        */

        const tweetedGuids = readJson(`data`);
        const feed = await readRss(`rss-url`);
        const firstItem = feed.items[0];
        // big-ass logic here to take a decision
        // then build a string from item
        const status = `${firstItem.title} \n${firstItem.link}`;
        postTweet(status);
        tweetedGuids[firstItem.guid] = true;
        writeJson(`data`);

        res.status(200).send(`Hellooo`);
    } catch (e) {
        res.status(500).send(e);
    }
};