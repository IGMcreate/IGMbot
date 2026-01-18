// const { EmbedBuilder } = require('discord.js');
// module.exports = async ({ client, inter, queue }) => { 
//     if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

//     if (!queue.tracks.toArray()[0]) return  inter.editReply({ content: `No music in the queue after the current one ${inter.member}... try again ? `, ephemeral: true });

//         const methods = ['', '🔁', '🔂'];

//         const songs = queue.tracks.length;

//         const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

//         const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

//         const embed = new EmbedBuilder()
//         .setColor('#ff0000')
//         .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
//         .setAuthor({name: `Server queue - ${inter.guild.name} ${methods[queue.repeatMode]}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
//         .setDescription(`Current ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
//         .setTimestamp()
//         .setFooter({ text: '', iconURL: inter.member.avatarURL({ dynamic: true })})

//         inter.editReply({ embeds: [embed], ephemeral: true });
// }
const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = async ({ client, inter }) => {
    const player = useMainPlayer();

    try {
        const queue = useQueue(inter.guildId);

        if (!queue || !queue.node.isPlaying())
            return inter.editReply({ content: `No music currently playing, ${inter.member}... try again?`, ephemeral: true });

        const tracks = queue.tracks.toArray();
        if (!tracks.length)
            return inter.editReply({ content: `No music in the queue after the current one, ${inter.member}... try again?`, ephemeral: true });

        const songs = tracks.length;
        const nextSongs = songs > 5
            ? `And **${songs - 5}** other song(s)...`
            : `In the playlist **${songs}** song(s)...`;

        const trackList = tracks.slice(0, 5).map((track, i) =>
            `**${i + 1}** - ${track.title} | ${track.author} (requested by: ${track.requestedBy?.username || 'Unknown'})`
        );

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({
                name: `Server queue - ${inter.guild.name}`,
                iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
            })
            .setDescription(`Current track: **${queue.currentTrack.title}**\n\n${trackList.join('\n')}\n\n${nextSongs}`)
            .setTimestamp()
            .setFooter({
                text: `Requested by ${inter.member.displayName}`,
                iconURL: inter.member.displayAvatarURL({ dynamic: true })
            });

        await inter.editReply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        console.error(error);
        await inter.editReply({ content: `An error occurred while fetching the queue, ${inter.member}. Please try again.`, ephemeral: true });
    }
};
