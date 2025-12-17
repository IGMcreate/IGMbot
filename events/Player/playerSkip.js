// const { EmbedBuilder } = require('discord.js');

// module.exports = (queue, track) => {

//     const playerSkip = new EmbedBuilder()
//         .setAuthor({ name: `Skipping **${track.title}** due to an issue! `, iconURL: track.thumbnail })
//         .setColor('#EE4B2B')

//     queue.metadata.send({ embeds: [playerSkip] })


// }
import { EmbedBuilder } from 'discord.js';

export default (queue, track) => {
    const playerSkip = new EmbedBuilder()
        .setAuthor({ name: `Skipping **${track.title}** due to an issue!`, iconURL: track.thumbnail })
        .setColor('#EE4B2B');

    queue.metadata.send({ embeds: [playerSkip] });
};
