const dataService = require(`./dataService`);
const readRss = require(`./rssReader`);
const {setupAndTweet} = require(`./twitterService`);

const dataFilename = `.data/data.json`;

const defaultRssFeed = `http://rss.walla.co.il/feed/6?type=main`; // Walla tech, no particular reason.
const defaultTwitterAccount = `bot1_syenite`; // "It's alive!"

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

        const key = req.params.key;
        const {rssUrl, twitterHandle} = resolveRssAndTwitterFromRequest(key);

        try {
            dataService.load();
        } catch (e) {
            sendError(res, `[${key}] Failed to load data.`, e);
            return;
        }

        let feed;
        try {
            feed = await readRss(rssUrl);
            // const feed = await readRss(`http://localhost:3000/.mock-data/mock-feed.xml`);
        } catch (e) {
            sendError(res, `[${key}] Failed to load RSS feed`, e);
            return;
        }

        let statuses = [];

        const candidates = feed.items || [];
        candidates.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

        candidates:
        for (const item of candidates) {
            const shouldTweet = isShouldTweet(item);

            if (shouldTweet) { // then build a string from item
                const status = createStatus(item);
                try {
                    setupAndTweet({twitterHandle, status});
                } catch (e) {
                    sendError(res, `[${key}] Failed to post tweet`, e);
                    return;
                }

                dataService.markItemAsTweeted(item.link);
                try {
                    dataService.save();
                } catch (e) {
                    sendError(res, `[${key}] Failed to save data, we may soon have a repeating tweet...`, e);
                    return;
                }

                statuses.push(`[${key}] Tweeted ${item.title}`);
                break candidates;
            } else {
                statuses.push(`[${key}] Not tweeted ${item.title}`);
            }
        }

        res.status(200).send(statuses.join(`\n`));
    } catch (e) {
        sendError(res, `[${key}] General error.`, e);
    }
}

const key2Details = new Map([
    [`irrelevant`, {
        rssUrl: `https://irrelevant.org.il/feed`,
        twitterHandle: `irrelevant_il`
    }],
    [`dailytech`, {
        rssUrl: `https://www.calcalist.co.il/GeneralRSS/0,16335,L-3862,00.xml`,
        twitterHandle: `dailytech_il`
    }],
    [`syenite`, {
        rssUrl: defaultRssFeed,
        twitterHandle: defaultTwitterAccount
    }],
    [`default`, {
        rssUrl: defaultRssFeed,
        twitterHandle: defaultTwitterAccount
    }]
]);

function resolveRssAndTwitterFromRequest(key) {
    if (key2Details.has(key)) {
        return key2Details.get(key);
    } else {
        return key2Details.get(`default`);
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

function sendError(res, shortDescription, e) {
    res.status(500).send(
        `${shortDescription}
         Message: ${e.message}
         Stack: ${e.stack}`
    );
}
