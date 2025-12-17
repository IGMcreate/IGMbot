// const { EmbedBuilder } = require('discord.js');

// module.exports = (queue) => {

//  const Disconnect = new EmbedBuilder()
//     .setAuthor({name: `Disconnected from the voice channel, clearing the queue! `})
//     .setColor('#2f3136')

// queue.metadata.send({ embeds: [Disconnect] })
// }
import { EmbedBuilder } from 'discord.js';

export default (queue) => {
    const Disconnect = new EmbedBuilder()
        .setAuthor({ name: `Disconnected from the voice channel, clearing the queue!` })
        .setColor('#2f3136');

    queue.metadata.send({ embeds: [Disconnect] });
};
