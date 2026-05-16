const { EmbedBuilder } = require('discord.js');
module.exports = async ({ client, inter, queue }) => {
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    queue.stop();

    const StopEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: `Music stopped into this server, see you next time ` })


    return inter.editReply({ embeds: [StopEmbed], ephemeral: true });

}
