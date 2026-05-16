const { EmbedBuilder } = require('discord.js');

module.exports = async ({ inter, queue }) => {
    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    const resumed = await queue.pauseState('resume');
    let message = `Current music ${queue.current.title} resumed `;
    
    if (!resumed) {
        await queue.pauseState('pause');
        message = `Current music ${queue.current.title} paused `;
    }

    const PauseEmbed = new EmbedBuilder()
            .setAuthor({ name: resumed ? `Current music ${queue.current.title} resumed ` : `Current music ${queue.current.title} paused ` })
            .setColor('#2f3136')

    return inter.editReply({ embeds: [PauseEmbed] });
}
