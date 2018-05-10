module.exports = { setupAndTweet };

const Twit = require('twit');

function setupAndTweet({twitterHandle, status} = {}) {
    if (!status) {
        throw new Error(`[${twitterHandle}] Can't tweet without status.`);
    }
    
    const prefix = twitterHandle ? `${twitterHandle}__` : ``;
    const config = {
        consumer_key: process.env[`${prefix}CONSUMER_KEY`],
        consumer_secret: process.env[`${prefix}CONSUMER_SECRET`],
        access_token: process.env[`${prefix}ACCESS_TOKEN`],
        access_token_secret: process.env[`${prefix}ACCESS_TOKEN_SECRET`]
    };
    const T = new Twit(config);
    
    T.post('statuses/update', { status });
}
