const striptags = require(`striptags`);
const twitterText = require(`twitter-text`);

module.exports = {createStatusFromItem};

function createStatusFromItem(item, contentField) {
    const { title, link } = item,
        content = item[contentField];
    let titleWithoutTags = title;
    try {
      titleWithoutTags = striptags(title).trim();   
    } catch (e) {}
  
    if (!content) {
        return createDefaultStatus(titleWithoutTags, link);
    }

    try {
        const contentWithoutTags = striptags(content).trim();
        const status = createStatus(titleWithoutTags, contentWithoutTags, link);
        return status;
    } catch (e) {
        return createDefaultStatus(title, link);
    }
}

function createDefaultStatus(title, link) {
    return [title, link].join(`\n\n`);
}

function createStatus(title, content, link) {
    const untrimmedStatus = [title, content, link].join(`\n\n`);
    let untrimmedStatusValid = false;
    try {
        untrimmedStatusValid = twitterText.parseTweet(untrimmedStatus).valid;
    } catch (e) {}
    if (untrimmedStatusValid) {
        // tweet it
        return untrimmedStatus;
    } else {
        for (let i = content.length - 1; i > 20; i--) { // No point in tweeting something very short, so let's stop at 20 characters.
            const trimmedContent = content.substring(0, i) + `...`;
            const trimmedStatus = [title, trimmedContent, link].join(`\n\n`);
            let trimmedStatusValid = false;
            try {
                trimmedStatusValid = twitterText.parseTweet(trimmedStatus).valid;
            } catch (e) {}
            if (trimmedStatusValid) {
                // tweet it
                return trimmedStatus;
            }
        }
        // too long and can't trim -- probably some error, tweet without content like before.
        const minimalStatus = createDefaultStatus(title, link);
        return minimalStatus;
    }
}
