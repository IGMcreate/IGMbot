// const { EmbedBuilder } = require('discord.js');
// const { useMainPlayer, useQueue, useTimeline } = require('discord-player');
// module.exports = async ({ client, inter, queue }) => { 
    
//     const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(inter.guildId);
//     if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

//     //const track = queue.currentTrack;

//     const methods = ['disabled', 'track', 'queue'];

//     //const timestamp = track.duration;
    
//     //const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;

//     const progress = queue.node.createProgressBar();
    

//     const embed = new EmbedBuilder()
//     .setAuthor({ name: track.title,  iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
//     .setThumbnail(track.thumbnail)
//     .setDescription(`Volume **${volume}**%\nDuration **${timestamp.total.label}**\nProgress ${progress}\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
//     .setFooter({ text: 'a', iconURL: inter.member.avatarURL({ dynamic: true })})
//     .setColor('ff0000')
//     .setTimestamp()

//     inter.editReply({ embeds: [embed], ephemeral: true });
// }
import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, useQueue, useTimeline } from 'discord-player';

export default async ({ client, inter, queue }) => { 
    const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(inter.guildId);
    if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing... try again ? `, ephemeral: true });

    const methods = ['disabled', 'track', 'queue'];
    const progress = queue.node.createProgressBar();

    const embed = new EmbedBuilder()
        .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setThumbnail(track.thumbnail)
        .setDescription(`Volume **${volume}**%\nDuration **${timestamp.total.label}**\nProgress ${progress}\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
        .setFooter({ text: 'a', iconURL: inter.member.avatarURL({ dynamic: true }) })
        .setColor('ff0000')
        .setTimestamp();

    inter.editReply({ embeds: [embed], ephemeral: true });
}