const MusicQueue = require('./musicQueue');

const queues = new Map();

function getQueue(guildId, connection) {
    if (!queues.has(guildId)) {
        queues.set(guildId, new MusicQueue(connection));
    }

    return queues.get(guildId);
}

function deleteQueue(guildId) {
    queues.delete(guildId);
}

module.exports = {
    getQueue,
    deleteQueue
};