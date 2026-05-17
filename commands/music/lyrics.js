const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'lyrics',
    description: 'get lyrics for the current track',
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing || !queue.current) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        try {

            const search = await genius.songs.search(queue.current.title);
            const song = search.find(song => song.artist.name.toLowerCase() === queue.current.author.toLowerCase()) || search[0];
            if (!song) return inter.editReply({ content: `No lyrics found for ${queue.current.title}... try again ? `, ephemeral: true });
            const lyrics = await song.lyrics();
            const embeds = [];
            for (let i = 0; i < lyrics.length; i += 4096) {
                const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 4096));
                embeds.push(new EmbedBuilder()
                    .setTitle(`Lyrics for ${queue.current.title}`)
                    .setDescription(toSend)
                    .setColor('#2f3136')
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${inter.member.displayName}` || 'Unknown user', iconURL: inter.member.displayAvatarURL({ dynamic: true }) || null})
                );
            }
            return inter.editReply({ embeds: embeds });

        } catch (error) {
            inter.editReply({ content: `Error!  `, ephemeral: true });
            console.log(error);
        }
    },
};

