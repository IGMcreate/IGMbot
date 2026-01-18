// const { EmbedBuilder } = require('discord.js');
// const { useMainPlayer, useQueue } = require('discord-player');

// module.exports = {
//     name: 'history',
//     description: 'See the history of the queue',
//     voiceChannel: false,

//     async execute({ inter }) {
// const queue = useQueue(inter.guildId);
//         const player = useMainPlayer()

//         if (!queue || queue.history.tracks.data.length == 0) return inter.editReply({ content: `No music has been played yet`, ephemeral: true });

//         const tracks = queue.history.tracks.data;
//         console.log(tracks)
        
//         try{

//         let description = tracks
//             .slice(0, 20)
//             .map((track, index) => { return `**${index + 1}.** [${track.title}](${track.url}) by ${track.author}` })
//             .join('\r\n\r\n');

//         let HistoryEmbed = new EmbedBuilder()
//             .setTitle(`History`)
//             .setDescription(description)
//             .setColor('#2f3136')
//             .setTimestamp()
//             .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true })})


//         inter.editReply({ embeds: [HistoryEmbed] });
//         } catch (e) {
//             console.log(e)
//         }
//     },
// };
import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';

export default {
    name: 'history',
    description: 'See the history of the queue',
    voiceChannel: false,

    async execute({ inter }) {
        const queue = useQueue(inter.guildId);
        const player = useMainPlayer();

        if (!queue || queue.history.tracks.data.length === 0) {
            return inter.editReply({ content: 'No music has been played yet', ephemeral: true });
        }

        const tracks = queue.history.tracks.data;
        console.log(tracks);

        try {
            const description = tracks
                .slice(0, 20)
                .map((track, index) => `**${index + 1}.** [${track.title}](${track.url}) by ${track.author}`)
                .join('\r\n\r\n');

            const HistoryEmbed = new EmbedBuilder()
                .setTitle('History')
                .setDescription(description)
                .setColor('#2f3136')
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${inter.member.displayName}`,
                    iconURL: inter.member.displayAvatarURL({ dynamic: true })
                });

            await inter.editReply({ embeds: [HistoryEmbed] });
        } catch (e) {
            console.error(e);
        }
    },
};
