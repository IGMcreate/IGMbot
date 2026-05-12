const MusicQueue = require('./musicQueue');

const queues = new Map();

function getQueue(guildId, connection) {
    if (!queues.has(guildId)) {
        queues.set(guildId, new MusicQueue(connection));
    }

    const queue = queues.get(guildId);
    if (connection && queue.connection !== connection) {
        queue.connection = connection;
        queue.subscribed = false;
    }
    return queue
}

function deleteQueue(guildId) {
    queues.delete(guildId);
}

module.exports = {
    getQueue,
    deleteQueue
};