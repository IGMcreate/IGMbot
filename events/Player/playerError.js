// const { EmbedBuilder } = require('discord.js');

// module.exports = (queue, error) => {
//     console.log(`Error emitted from the Player ${error.message}`);
//     const track = queue.current;
//     const ErrorEmbed = new EmbedBuilder()
//         .setAuthor({
//             name: `Bot had an unexpected error, please check the console!`,
//             iconURL: track ? track.thumbnail : null
//         })
//         .setColor('#EE4B2B')

//     queue.metadata.send({ embeds: [ErrorEmbed] })

// }
import { EmbedBuilder } from 'discord.js';

export default (queue, error) => {
    console.log(`Error emitted from the Player: ${error.message}`);

    const track = queue.current;
    const ErrorEmbed = new EmbedBuilder()
        .setAuthor({
            name: `Bot had an unexpected error, please check the console!`,
            iconURL: track ? track.thumbnail : undefined
        })
        .setColor('#EE4B2B');

    queue.metadata.send({ embeds: [ErrorEmbed] });
};
