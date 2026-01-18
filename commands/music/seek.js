// const ms = require('ms');
// const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
// const { useMainPlayer, useQueue, useTimeline } = require('discord-player');

// module.exports = {
//     name: 'seek',
//     description: 'skip back or foward in a song',
//     voiceChannel: true,
//     options: [
//         {
//             name: 'time',
//             description: 'time that you want to skip to',
//             type: ApplicationCommandOptionType.String,
//             required: true,
//         }
//     ],
//     async execute({ inter }) {
//         const player = useMainPlayer()
//         const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(inter.guildId);
//         var timeToMS = 0
//         const queue = useQueue(inter.guild);

//         if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing ${inter.editReply}... try again ? `, ephemeral: true });
        
//         if (inter.options.getString('time')[inter.options.getString('time').length - 1] != '%')  {               
//             timeToMS = ms(inter.options.getString('time'));
//             //console.log(timeToMS)
//         } else {
//             //console.log(timestamp.total.label);
//             let [minutes, seconds] = timestamp.total.label.split(":");
//             let totalseconds = parseInt(minutes) * 60 + parseInt(seconds);

//             timeToMS = (totalseconds * (inter.options.getString('time').slice(0, -1)) * 10);
//             //console.log(timeToMS.toString())
//         }

//         if (timeToMS >= queue.currentTrack.durationMS) return inter.editReply({ content: `The indicated time is higher than the total time of the current song ${inter.member}... try again ? \n*Try for example a valid time like **5s, 10s, 20 seconds, 1m**...*`, ephemeral: true });

//         await queue.node.seek(timeToMS);

//         const SeekEmbed = new EmbedBuilder()
//             .setColor('#2f3136')
//             .setAuthor({ name: `Time set on the current song **${ms(timeToMS, { long: true })}** ` })


//         inter.editReply({ embeds: [SeekEmbed] });
//     },
// };
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const ms = require('ms');

module.exports = {
    name: 'seek',
    description: 'seek to a specific time in the current track',
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description: 'the time to seek to (e.g. 1m30s, 90s, 50%)',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guildId);

        if (!queue || !queue.node.isPlaying() || !queue.currentTrack)
            return inter.editReply({ content: `No music currently playing ${inter.member}... try again ?`, ephemeral: true });

        const input = inter.options.getString('time');
        const duration = Math.floor(queue.currentTrack.durationMS / 1000);

        let seekTime;
        let msg;

        if (input.endsWith('%')) {
            const percent = parseInt(input.replace('%', ''), 10);
            if (isNaN(percent) || percent < 0 || percent > 100)
                return inter.editReply({ content: `Please provide a percent between 0 and 100.`, ephemeral: true });
            seekTime = Math.floor((percent / 100) * duration);
            msg = `Seeked to ${percent}% (${seekTime} seconds) in ${queue.currentTrack.title}`;
        } else {
            let time = ms(input) / 1000;
            if (isNaN(time) || time < 0) {
                // fallback: try parsing as integer seconds
                time = parseInt(input, 10);
            }
            if (isNaN(time) || time < 0 || time > duration)
                return inter.editReply({ content: `Please provide a valid time (e.g. 1m30s, 90s, or percent) between 0 and ${duration} seconds.`, ephemeral: true });
            seekTime = Math.floor(time);
            msg = `Seeked to ${seekTime} seconds in ${queue.currentTrack.title}`;
        }

        await queue.node.seek(seekTime * 1000);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(msg);

        return inter.editReply({ embeds: [embed] });
    },
};