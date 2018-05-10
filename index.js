/*
TODO
twitter, app, keys
data service
chokidar -- maybe not
handler/s
tests -- mocha?
test page
test data
LOG!
 */

const express = require('express'),
    app = express(),
    tweetRss = require(`./tweetRss`);

app.use(express.static('public'));

// This bot can read one of a few RSS feeds and then tweet to the appropriate account -- determined by :key.
app.all(`/tweetRss/:key`, tweetRss);

const listener = app.listen(process.env.PORT, () => {
    console.log(`Bot is running on port ${listener.address().port}`);
});
