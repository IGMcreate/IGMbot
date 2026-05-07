const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'shuffle',
    description: 'shuffle the track',
    voiceChannel: true,

    async execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing) return await inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        console.log(queue.queue)
        if (!queue.queue[0]) return inter.editReply({ content: `No music in the queue after the current one ${inter.member}... try again ? `, ephemeral: true });

        await queue.shuffle();

        const ShuffleEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Queue shuffled ${queue.queue.length} song(s)! ` })


        return inter.editReply({ embeds: [ShuffleEmbed] });
    },
};