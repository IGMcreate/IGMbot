const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'skip',
    description: 'skip the track',
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        const queue = getQueue(channel.guild.id, connection);

        console.log(queue)
        if (!queue || !queue.isPlaying()) return await inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        queue.skip();

        const SkipEmbed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor(`Current music ${queue.currentTrack.title} skipped ` )


        await inter.editReply({ embeds: [SkipEmbed] });

    },
};