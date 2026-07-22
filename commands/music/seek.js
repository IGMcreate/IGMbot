const {
    getVoiceConnection
} = require('@discordjs/voice');

const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

const ms = require('ms');

module.exports = {
    name: 'seek',
    description: 'seek to a specific time in the current track',
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description: 'the time to seek to (e.g. 1m30s, 90s, 50%)',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing || !queue.current)
            return inter.editReply({ content: `No music currently playing ${inter.member}... try again ?`, ephemeral: true });

        const input = inter.options.getString('time');
        const duration = Math.floor(queue.current.duration);

        let seekTime;
        let msg;

        if (input.endsWith('%')) {
            const percent = parseInt(input.replace('%', ''), 10);
            if (isNaN(percent) || percent < 0 || percent > 100)
                return inter.editReply({ content: `Please provide a percent between 0 and 100.`, ephemeral: true });
            seekTime = Math.floor((percent / 100) * duration);
            msg = `Seeked to ${percent}% (${seekTime} seconds) in ${queue.current.title}`;
        } else {
            let time = ms(input) / 1000;
            if (isNaN(time) || time < 0) {
                // fallback: try parsing as integer seconds
                time = parseInt(input, 10);
            }
            if (isNaN(time) || time < 0 || time > duration)
                return inter.editReply({ content: `Please provide a valid time (e.g. 1m30s, 90s, or percent) between 0 and ${duration} seconds.`, ephemeral: true });
            seekTime = Math.floor(time);
            msg = `Seeked to ${seekTime} seconds in ${queue.current.title}`;
        }
        formattedSeekTime = new Date(seekTime * 1000).toISOString().slice(11, 19);
        await queue.next(true, formattedSeekTime);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(msg);

        return inter.editReply({ embeds: [embed] });
    },
};