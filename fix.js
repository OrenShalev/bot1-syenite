const dataService = require(`./dataService`);

console.log('start');

dataService.load();
const data = dataService.get();
const tweetedLinks = data.tweetedLinks;

console.log(JSON.stringify(data).length);

delete tweetedLinks[undefined];
// delete tweetedLinks.blogim;

console.log(JSON.stringify(data).length);

dataService.set(data);
dataService.save();


console.log('finish');