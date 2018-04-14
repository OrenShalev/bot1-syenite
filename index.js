/*
TODO
twitter, app, keys
data service
chokidar
handlers
test page
test data
log
 */
// import testt from './testHandler';
const express = require('express'),
    app = express(),
    testHandler = require(`./testHandler`);

app.use(express.static('public'));

app.all(`/test`, testHandler);

const listener = app.listen(/*process.env.PORT*/ 3000, function () {
    console.log('Your bot is running on port ' + listener.address().port);
});
