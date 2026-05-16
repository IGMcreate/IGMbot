const {
    getVoiceConnection
} = require('@discordjs/voice');

const maxVol = client.config.opt.maxVol;
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'volume',
    description: 'adjust',
    voiceChannel: true,
    options: [
        {
            name: 'volume',
            description: 'the amount volume',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: maxVol
        }
    ],

    execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        const vol = inter.options.getNumber('volume')

        if (queue.volume === vol) return inter.editReply({ content: `The volume you want to change is already the current one ${inter.member}... try again ? `, ephemeral: true });

        const success = queue.setVolume(vol);

        return inter.editReply({ content: success ? `The volume has been modified to ${vol}%/${maxVol}% ` : `Something went wrong ${inter.member}... try again ? ` });
    },
};