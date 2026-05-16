const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue, deleteQueue } = require('../../src/queueStore');

module.exports = {
    name: 'stop',
    description: 'stop the track',
    voiceChannel: true,

    execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        queue.stop();

        const StopEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Music stopped into this server, see you next time ` })


        return inter.editReply({ embeds: [StopEmbed] });

    },
};