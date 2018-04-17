const dataService = require(`./dataService`);
const readRss = require(`./rssReader`);
const {postTweet} = require(`./twitterService`);

const dataFilename = `.data/data.json`;
module.exports = testHandler;

async function testHandler(req, res) {
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

        let statuses = [];

        const candidates = feed.items.slice(0, 3);
        candidates.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

        for (const item of candidates) {
            const shouldTweet = isShouldTweet(item);

            if (shouldTweet) { // then build a string from item
                const status = createStatus(item);
                try {
                    postTweet(status);
                } catch (e) {
                    res.status(500).send(
                        `Failed to post tweet.
                        Message: ${e.message}
                        Stack: ${e.stack}`
                    );
                    return;
                }

                dataService.markItemAsTweeted(item.link);
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

                statuses.push(`Tweeted ${item.title}`);
            } else {
                statuses.push(`Not tweeted ${item.title}`);
            }
        }

        res.status(200).send(statuses.join(`\n`));
    } catch (e) {
        res.status(500).send(
            `General error.
            Message: ${e.message}
            Stack: ${e.stack}`
        );
    }
}

function isShouldTweet(item) {
// big-ass logic here to take a decision
    const tweeted = dataService.isItemTweeted(item.link);
    return !tweeted;
}

function createStatus(item) {
    return `${item.title} \n${item.link}`;
}
