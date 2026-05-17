const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'queue',
    description: 'Get the songs in the queue',
    voiceChannel: true,

    async execute({ client, inter }) {

        try {
            const channel = inter.member.voice.channel;
            const connection = getVoiceConnection(channel.guild.id);
            if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
            const queue = getQueue(channel.guild.id, connection);

            if (!queue) return inter.editReply({ content: `No music currently playing, ${inter.member}... try again?`, ephemeral: true });

            const tracks = queue.queue;
            if (!tracks.length) return inter.editReply({ content: `No music in the queue after the current one, ${inter.member}... try again?`, ephemeral: true });

            const songs = tracks.length;

            // If there are more than 5 songs, show how many are left
            const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;
            const user = [];
            // List out the first 5 tracks
            const trackList = await Promise.all(tracks.slice(0, 5).map(async (track, i) => {
                let user = client.users.cache.get(track.user)

                if (!user) {
                    try {
                        user = await client.users.fetch(track.user);
                    } catch {
                        user = { globalName: 'Unknown User' };
                    }
                }

                return `**${i + 1}** - ${track.title} |  (requested by: ${user.globalName})`;
            }));
            const loopmode = queue.repeatMode === 'typeQueue' ? 'Queue' : queue.repeatMode === 'typeTrack' ? 'Song' : 'Disabled';
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
                .setAuthor({
                    name: `Server queue - ${inter.guild.name}`,
                    iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
                })
                .setDescription(`Current track: **${queue.current.title}**\nLoop mode: **${loopmode}**\n\n${trackList.join('\n')}\n\n${nextSongs}`)
                .setTimestamp()
                .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true }) });

            inter.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            inter.editReply({ content: `An error occurred while fetching the queue, ${inter.member}. Please try again.`, ephemeral: true });
        }
    },
};
