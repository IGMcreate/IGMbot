const { EmbedBuilder } = require('discord.js');

module.exports = async ({ client, inter, queue }) => {

    if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    const track = queue.current;
    const duration = (Math.floor(track.duration / 60)).toString() + ":" + (track.duration % 60).toString().padStart(2, "0");
    const progress = queue.createProgressBar();
    const volume = queue.volume;
    const repeatModes = ['disabled', 'track', 'queue', 'autoplay'];
    const repeatMode = typeof queue.repeatMode === 'number' ? queue.repeatMode : queue.repeatMode?.mode ?? 0;

    let user = client.users.cache.get(track.user)

    if (!user) {
        try {
            user = await client.users.fetch(track.user);
        } catch {
            user = { globalName: 'Unknown User' }; // Fallback if user left or cannot be found
        }
    }

    const embed = new EmbedBuilder()
        .setAuthor({ name: track.title, iconURL: inter.client.user.displayAvatarURL({ size: 1024, dynamic: true }), url: track.url })
        .setThumbnail(track.thumbnail)
        .setDescription(
            `Volume **${volume}**%\n` +
            `Duration **${duration}**\n` +
            `Progress ${progress}\n` +
            `Loop mode **${repeatModes[repeatMode]}**\n` +
            `Added by ${user.globalName}`
        )
        .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true }) })
        .setColor('#2f3136')
        .setTimestamp();

    inter.editReply({ embeds: [embed], ephemeral: true });
}
