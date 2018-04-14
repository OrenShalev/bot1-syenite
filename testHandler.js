const dataService = require(`./dataService`);
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

        try {
            dataService.load();
        } catch (e) {
            res.status(500).send(
                `Failed to load data.
                Message: ${e.message}
                Stack: ${e.stack}`
            );
            return;
        }

        let feed;
        try {
            feed = await readRss(`http://rss.walla.co.il/feed/6?type=main`);
            // const feed = await readRss(`http://localhost:3000/.mock-data/mock-feed.xml`);
        } catch (e) {
            res.status(500).send(
                `Failed to load RSS feed.
                Message: ${e.message}
                Stack: ${e.stack}`
            );
            return;
        }

        const firstItem = feed.items[0];

        // big-ass logic here to take a decision
        const tweeted = dataService.isItemTweeted(firstItem.link);

        if (!tweeted) { // then build a string from item
            const status = `${firstItem.title} \n${firstItem.link}`;
            try {
                // postTweet(status);
            } catch (e) {
                res.status(500).send(
                    `Failed to post tweet.
                    Message: ${e.message}
                    Stack: ${e.stack}`
                );
                return;
            }

            dataService.markItemAsTweeted(firstItem.link);
            try {
                dataService.save();
            } catch (e) {
                res.status(500).send(
                    `Failed to load save data, we may soon have a repeating tweet...
                    Message: ${e.message}
                    Stack: ${e.stack}`
                );
                return;
            }

            res.status(200).send(`Tweeted ${firstItem.title}`);
        } else {
            res.status(200).send(`Not tweeted ${firstItem.title}`);
        }
    } catch (e) {
        res.status(500).send(
            `General error.
            Message: ${e.message}
            Stack: ${e.stack}`
        );
    }
};
