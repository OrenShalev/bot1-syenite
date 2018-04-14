const Twit = require('twit'),
    config = {
        /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */
        twitter: {
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET
        }
    },
    T = new Twit(config.twitter);

function postTweet(status) {
    T.post('statuses/update', { status });
}

module.exports = { postTweet };
