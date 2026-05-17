const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'save',
    description: 'save the current track!',
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);
        const duration = (Math.floor(queue.current.duration / 60)).toString() + ":" + (queue.current.duration % 60).toString().padStart(2, "0")

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        inter.member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('#2f3136')
                    .setTitle(`${queue.current.title}`)
                    .setURL(queue.current.url)
                    .addFields(
                        { name: 'Duration:', value: `\`${duration}\``, inline: true },
                        { name: 'Song by:', value: `\`${queue.current.author}\``, inline: true },
                        //{ name: 'Views :eyes:', value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
                        { name: 'Song URL:', value: `\`${queue.current.url}\`` }
                    )
                    .setThumbnail(queue.current.thumbnail)
                    .setFooter({ text: `from the server ${inter.member.guild.name}`, iconURL: inter.member.guild.iconURL({ dynamic: false }) })
            ]
        }).then(() => {
            return inter.editReply({ content: `I have sent you the title of the music by private messages `, ephemeral: true });
        }).catch(error => {
            return inter.editReply({ content: `Unable to send you a private message... try again ? `, ephemeral: true });
        });
    },
};