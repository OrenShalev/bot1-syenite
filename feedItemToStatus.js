module.exports = createStatusFromItem;

function createStatusFromItem({ title, content, link } = {}) {
    return createDefaultStatus(title, link);
}

function createDefaultStatus(title, link) {
    return [title, link].join(`\n`);
}
