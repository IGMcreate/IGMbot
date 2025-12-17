// const { EmbedBuilder } = require('discord.js');
// const { useMainPlayer, useQueue  } = require('discord-player');

// module.exports = {
//     name: 'queue',
//     description: 'Get the songs in the queue',
//     voiceChannel: true,

//     execute({ client, inter }) {
//         const player = useMainPlayer()

//         try {

//         const queue = useQueue(inter.guild);

//         if (!queue) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

//         if (!queue.tracks.toArray()[0]) return  inter.editReply({ content: `No music in the queue after the current one ${inter.member}... try again ? `, ephemeral: true });

//         const methods = ['', '', ''];

//         const songs = queue.tracks.data.length;

//         const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

//         const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

//         const embed = new EmbedBuilder()
//         .setColor('#2f3136')
//         .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
//         .setAuthor({name: `Server queue - ${inter.guild.name} ${methods[queue.repeatMode]}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
//         .setDescription(`Current ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
//         .setTimestamp()
//         .setFooter({ text: '', iconURL: inter.member.avatarURL({ dynamic: true })})

//         inter.editReply({ embeds: [embed] });
   
//         } catch (error) 
//         {
//         inter.editReply({ content: `Nah`, ephemeral: true });
//         } 
//     },
    
// };

const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    name: 'queue',
    description: 'Get the songs in the queue',
    voiceChannel: true,

    execute({ client, inter }) {
        const player = useMainPlayer();

        try {
            const queue = useQueue(inter.guild);

            if (!queue) return inter.editReply({ content: `No music currently playing, ${inter.member}... try again?`, ephemeral: true });

            const tracks = queue.tracks.data; // Correctly access the tracks array
            if (!tracks.length) return inter.editReply({ content: `No music in the queue after the current one, ${inter.member}... try again?`, ephemeral: true });

            const songs = tracks.length;

            // If there are more than 5 songs, show how many are left
            const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

            // List out the first 5 tracks
            const trackList = tracks.slice(0, 5).map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by: ${track.requestedBy.username})`);

            // Create an embed to display the queue
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
                .setAuthor({
                    name: `Server queue - ${inter.guild.name}`,
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
                })
                .setDescription(`Current track: **${queue.currentTrack.title}**\n\n${trackList.join('\n')}\n\n${nextSongs}`)
                .setTimestamp()
                .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true })});

            inter.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            inter.editReply({ content: `An error occurred while fetching the queue, ${inter.member}. Please try again.`, ephemeral: true });
        }
    },
};
