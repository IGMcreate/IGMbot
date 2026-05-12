const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'resume',
    description: 'resume the track',
    voiceChannel: true,

    async execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        const success = await queue.pauseState('resume');
        const ResumeEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? `Current music ${queue.current.title} resumed ` : `Music is already playing!` })
            .setColor('#2f3136')

        return inter.editReply({ embeds: [ResumeEmbed] });
    },
};