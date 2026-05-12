const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'nowplaying',
    description: 'view what is playing!',
    voiceChannel: true,

    async execute({ inter }) {
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        const track = queue.current;
        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();
        const volume = queue.node.volume;
        const repeatModes = ['disabled', 'track', 'queue', 'autoplay'];
        const repeatMode = typeof queue.repeatMode === 'number' ? queue.repeatMode : queue.repeatMode?.mode ?? 0;

        const embed = new EmbedBuilder()
            .setAuthor({ name: track.title, iconURL: inter.client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setThumbnail(track.thumbnail)
            .setDescription(
                `Volume **${volume}**%\n` +
                `Duration **${timestamp.total.label}**\n` +
                `Progress ${progress}\n` +
                `Loop mode **${repeatModes[repeatMode]}**\n` +
                `Requested by ${track.requestedBy}`
            )
            .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true })})
            .setColor('#2f3136')
            .setTimestamp();

        const saveButton = new ButtonBuilder()
            .setLabel('Save this track')
            .setCustomId(JSON.stringify({ ffb: 'savetrack' }))
            .setStyle('Danger');

        const volumeup = new ButtonBuilder()
            .setLabel('Volume up')
            .setCustomId(JSON.stringify({ ffb: 'volumeup' }))
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel('Volume Down')
            .setCustomId(JSON.stringify({ ffb: 'volumedown' }))
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel('Loop')
            .setCustomId(JSON.stringify({ ffb: 'loop' }))
            .setStyle('Danger');

        const resumepause = new ButtonBuilder()
            .setLabel('Resume & Pause')
            .setCustomId(JSON.stringify({ ffb: 'resume&pause' }))
            .setStyle('Success');

        const row = new ActionRowBuilder().addComponents(volumedown, saveButton, resumepause, loop, volumeup);

        await inter.editReply({ embeds: [embed], components: [row] });
    },
};