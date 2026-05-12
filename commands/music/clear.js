const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'clear',
    description: 'clear all the music in the queue',
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        if (!queue.queue.length) return inter.editReply({ content: `No music in the queue after the current one ${inter.member}... try again ? `, ephemeral: true });

        queue.queue = [];

        const ClearEmbed = new EmbedBuilder()
            .setAuthor({ name: `The queue has just been cleared ` })
            .setColor('#2f3136')

        await inter.editReply({ embeds: [ClearEmbed] });

    },
};
