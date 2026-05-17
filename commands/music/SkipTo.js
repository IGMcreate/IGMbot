const {
    getVoiceConnection
} = require('@discordjs/voice');

const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'skipto',
    description: "skips to particular track in queue",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'the name/url of the track you want to skip to',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description: 'the place in the queue the song is in',
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const number = inter.options.getNumber('number')
        const track = inter.options.getString('song');
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        if (!track && !number) inter.editReply({ content: `You have to use one of the options to jump to a song ${inter.member}... try again ? `, ephemeral: true });

        if (track) {
            clean_url = (url) => url.replace(/^(https?:\/\/)?(www\.)?/, '')
            const track_skipTo = queue.queue.find((t) => t.title.toLowerCase() === track.toLowerCase() || clean_url(t.url) === clean_url(track));
            if (!track_skipTo) return inter.editReply({ content: `could not find ${track} ${inter.member}... try using the url or the full name of the song ? `, ephemeral: true });
            queue.skipTo(track_skipTo);
            return inter.editReply({ content: `Jumped to ${track_skipTo.title}  ` });
        }
        if (number) {
            const index = number - 1
            const trackname = queue.queue[index]?.title;
            if (!trackname) return inter.editReply({ content: `This track dose not seem to exist ${inter.member}...  try again ?`, ephemeral: true });
            queue.skipTo(queue.queue[index]);

            const skipToEmbed = new EmbedBuilder()
                .setAuthor({ name: `Skiped to ${trackname} ` })
                .setColor('#2f3136')

            inter.editReply({ embeds: [skipToEmbed] });
        }

    }
}
