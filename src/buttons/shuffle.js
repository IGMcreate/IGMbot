const { EmbedBuilder } = require('discord.js');

module.exports = async ({ client, inter, queue }) => { 
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    if (!queue.queue[0]) return inter.editReply({ content: `No music in the queue after the current one ${inter.member}... try again ? `, ephemeral: true });

        await queue.shuffle();

        const ShuffleEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: `Queue shuffled ${queue.queue.length} song(s)! ` })


       return inter.editReply({ embeds: [ShuffleEmbed], ephemeral: true});
}
