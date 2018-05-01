# 🤖 bot1-syenite
Bot that reads RSS feeds and publishes items as tweets. [Here](https://twitter.com/irrelevant_il)'s one of the Twitter accounts run by this project.

## 🎩 Description
When triggered by an http/s request, reads an RSS feed, and tweets an item from it if the feed contains an item (or items) which were not tweeted before.

RSS feed items are checked by publication date and the first non-tweeted item is tweeted. 

## 🐭 Motivation
I wanted to read new items from ["Irrelevant" (לא רלוונטי)](https://irrelevant.org.il/) soon after they are published. While an RSS feed is available, I open my RSS reader rarely. On the other hand, I open Twitter regularly so getting new items in my Twitter feed would work perfectly.

Also, it's a nice exercise with several aspects of development I did not get a chance to try before.

## 📚 Name
To POC a few aspects of this bot, I first created bot0-damaya ([Twitter](https://twitter.com/bot0_damaya), [GitHub](https://github.com/OrenShalev/bot0-damaya), [Glitch](https://glitch.com/edit/#!/bot0-damaya)).

Damaya and Syenite are characters in the first book of the wonderful trilogy ["The Broken Earth"](https://www.amazon.com/gp/bookseries/B01947LZ8A).

## ⚙️ How it works
1. Online service ([uptimerobot](https://uptimerobot.com/)) periodically pings the URL where the app is hosted and listening.
1. Node.js app hosted on [Glitch](https://glitch.com), listening to incoming http/s requests. If you are unfamiliar with Glitch -- I highly recommend it!
1. Simple [Express](https://www.npmjs.com/package/express) app responds to requests of the form "/tweetRss/:key". There are several defined keys, each of them associated with an RSS feed URL and a Twitter account.
1. If the key is recognized, the relevant RSS feed is fetched and parsed with [rss-parser](https://www.npmjs.com/package/rss-parser).
1. The feed items are iterated on in their chronological order, looking for an item which wasn't tweeted yet. Links which were tweeted are stored in a simple JSON file under .data/ folder which Glitch takes care to persist but is also private -- not a very robust solution but works.
1. If an untweeted item is found, a tweet is composed and then tweeted with the relevant account using [Twit](https://www.npmjs.com/package/twit). The keys to the twitter accounts are stored in environment variables -- again maybe not ideal but works.
1. The link is marked as tweeted so it won't be tweeted again in the future.
1. Once an item is tweeted, no more items are considered for tweeting, so as to not flood with tweets if the bot was down for a while, or just started going over a new feed.

## 🐦 Twitter accounts operated by this bot
* The glorious Irrelevant bot [@irrelevant_il](https://twitter.com/irrelevant_il), tweeting recommendations from Hanan Cohen's irrelevant.org.il to forward or not to forward rumors and chain letters.
* Daily Tech bot [@dailytech_il](https://twitter.com/dailytech_il), tweeting the excellent tech column by Yossi Gurevitch at Calcalist.
* The humble [@bot1_syenite](https://twitter.com/bot1_syenite), used as the first "serious" practice bot, tweeting items from some random RSS feed I found (Walla Tech at the moment.

## 🐾 To-do
- [x] List of to-dos.
- [x] Description what this bot does.
- [x] Motivation.
- [ ] Link/s to glitch.
- [x] Description how the bot works.
- [x] Links to Twitter accounts
- [ ] 3rd-parties used.
- [ ] Credits.
- [x] Explain name.
- [ ] Areas for improvements: data handling, forkability, organize code, document code.
- [ ] Call for pull requests.
- [ ] Delete list of to-dos.
