// const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
// const { useMainPlayer, useQueue, useTimeline } = require('discord-player');

// module.exports = {
//     name: 'nowplaying',
//     description: 'view what is playing!',
//     voiceChannel: true,

//     execute({ inter }) {
//         const queue = useQueue(inter.guild);
//         const player = useMainPlayer()
//         const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(inter.guildId);
//         if (!queue) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
//         //const track = queue.tracks.data[0];
//         //const track = queue.currentTrack;

//         const methods = ['disabled', 'track', 'queue', 'autoplay'];

//         //const timestamp = queue.tracks.data[0].duration;

//         //const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : queue.tracks.data[0].duration;

//         const progress = queue.node.createProgressBar();


//         const embed = new EmbedBuilder()
//             .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
//             .setThumbnail(track.thumbnail)
//             .setDescription(`Volume **${volume}**%\nDuration **${timestamp.total.label}**\nProgress ${progress}\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
//             .setFooter({ text: 'a', iconURL: inter.member.avatarURL({ dynamic: true }) })
//             .setColor('#2f3136')
//             .setTimestamp()

//         const saveButton = new ButtonBuilder()
//             .setLabel('Save this track')
//             .setCustomId(JSON.stringify({ ffb: 'savetrack' }))
//             .setStyle('Danger')

//         const volumeup = new ButtonBuilder()
//             .setLabel('Volume up')
//             .setCustomId(JSON.stringify({ ffb: 'volumeup' }))
//             .setStyle('Primary')

//         const volumedown = new ButtonBuilder()
//             .setLabel('Volume Down')
//             .setCustomId(JSON.stringify({ ffb: 'volumedown' }))
//             .setStyle('Primary')

//         const loop = new ButtonBuilder()
//             .setLabel('Loop')
//             .setCustomId(JSON.stringify({ ffb: 'loop' }))
//             .setStyle('Danger')

//         const resumepause = new ButtonBuilder()
//             .setLabel('Resume & Pause')
//             .setCustomId(JSON.stringify({ ffb: 'resume&pause' }))
//             .setStyle('Success')



//         const row = new ActionRowBuilder().addComponents(volumedown, saveButton, resumepause, loop, volumeup);

//         inter.editReply({ embeds: [embed], components: [row] });
//     },
// };
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    name: 'nowplaying',
    description: 'view what is playing!',
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guildId);
        if (!queue || !queue.currentTrack) {
            return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        }

        const track = queue.currentTrack;
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