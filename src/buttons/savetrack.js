const { EmbedBuilder } = require('discord.js')

module.exports = async ({ inter, queue }) => {
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    inter.member.send({
        embeds: [
            new EmbedBuilder()
                .setColor('Red')
                .setTitle(queue.current.title)
                .setURL(queue.current.url)
                .addFields(
                    { name: 'Duration:', value: `\`${queue.current.duration}\``, inline: true },
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


}
