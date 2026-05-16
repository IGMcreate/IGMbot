const { EmbedBuilder } = require('discord.js');

module.exports = async ({ inter, queue }) => {
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    if (queue.history.length < 2) return inter.editReply({ content: `There was no music played before ${inter.member}... try again ? `, ephemeral: true });

    await queue.back();

    const BackEmbed = new EmbedBuilder()
        .setAuthor({ name: `Playing the previous track ` })
        .setColor('#2f3136')

    await inter.editReply({ embeds: [BackEmbed] });
}
