const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'back',
    description: "Go back the song before",
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue.history) return inter.editReply({ content: `No music history ${inter.member}... try again ? `, ephemeral: true });
        //console.log(queue.history);
        await queue.back();

        const BackEmbed = new EmbedBuilder()
            .setAuthor({ name: `Playing the previous track ` })
            .setColor('#2f3136')

        await inter.editReply({ embeds: [BackEmbed] });
    },
};
