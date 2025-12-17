// const { QueryType, useMainPlayer, useQueue } = require('discord-player');
// const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
// const { YoutubeiExtractor } = require('discord-player-youtubei');

// module.exports = {
//     name: 'play',
//     description: "play a song!",
//     voiceChannel: true,
//     options: [
//         {
//             name: 'song',
//             description: 'the song you want to play',
//             type: ApplicationCommandOptionType.String,
//             required: true,
//         }
//     ],

//     async execute({ inter, client }) {
//         const player = useMainPlayer()

//         const song = inter.options.getString('song');


//         console.log(`Searching for: ${song}`);
//         //console.log('YoutubeiExtractor registered:', player.extractors.has(YoutubeiExtractor));
//         const isURL = song.startsWith('http://') || song.startsWith('https://');
//         const queryType = QueryType.YoutubeiExtractor // isURL ? QueryType.YOUTUBE_PLAYLIST : QueryType.YOUTUBE_SEARCH;
//         const res = await player.search(song, {
//             //fallbackSearchEngine: QueryType.AUTO,
//             requestedBy: inter.member,
//             searchEngine: queryType
//         });
//         console.log(`Results found: ${res.tracks.length}`);

//         const NoResultsEmbed = new EmbedBuilder()
//             .setAuthor({ name: `No results found... try again ? ` })
//             .setColor('#2f3136')

//         if (!res || !res.tracks.length) return inter.editReply({ embeds: [NoResultsEmbed] });


//         const queue = player.nodes.get(inter.guild.id) || await player.nodes.create(inter.guild, {
//             metadata: inter.channel,
//             spotifyBridge: client.config.opt.spotifyBridge,
//             volume: client.config.opt.volume,
//             leaveOnEmpty: client.config.opt.leaveOnEmpty,
//             leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
//             leaveOnEnd: client.config.opt.leaveOnEnd,
//             leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
//         });

//         try {
//             if (!queue.connection) await queue.connect(inter.member.voice.channel);
//         } catch {
//             await player.deleteQueue(inter.guildId);

//             const NoVoiceEmbed = new EmbedBuilder()
//                 .setAuthor({ name: `I can't join the voice channel... try again ? ` })
//                 .setColor('#2f3136')

//             return inter.editReply({ embeds: [NoVoiceEmbed] });
//         }

//         const playEmbed = new EmbedBuilder()
//             .setAuthor({ name: `Loading your ${res.playlist ? 'playlist' : 'track'} to the queue... ` })
//             .setColor('#2f3136')

//         await inter.editReply({ embeds: [playEmbed] });


//         res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);

//         //console.log('Tracks in queue:', queue.tracks);
//         //console.log('Queue length:', queue.tracks.data.length);
//         //console.log('Queue length:', queue.node);
//         //console.log(queue.tracks.data[0].raw);

//         if (!queue.isPlaying()) await queue.node.play();
//     },
// };
import { QueryType, useMainPlayer, useQueue } from 'discord-player';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { YoutubeiExtractor } from 'discord-player-youtubei';

export default {
    name: 'play',
    description: "play a song!",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'the song you want to play',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer();

        const song = inter.options.getString('song');

        console.log(`Searching for: ${song}`);
        const isURL = song.startsWith('http://') || song.startsWith('https://');
        const queryType = QueryType.YoutubeiExtractor; // isURL ? QueryType.YOUTUBE_PLAYLIST : QueryType.YOUTUBE_SEARCH

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: queryType
        });

        console.log(`Results found: ${res.tracks.length}`);

        const NoResultsEmbed = new EmbedBuilder()
            .setAuthor({ name: `No results found... try again?` })
            .setColor('#2f3136');

        if (!res || !res.tracks.length) return inter.editReply({ embeds: [NoResultsEmbed] });

        const queue = player.nodes.get(inter.guild.id) || await player.nodes.create(inter.guild, {
            metadata: inter.channel,
            spotifyBridge: global.client.config.opt.spotifyBridge,
            volume: global.client.config.opt.volume,
            leaveOnEmpty: global.client.config.opt.leaveOnEmpty,
            leaveOnEmptyCooldown: global.client.config.opt.leaveOnEmptyCooldown,
            leaveOnEnd: global.client.config.opt.leaveOnEnd,
            leaveOnEndCooldown: global.client.config.opt.leaveOnEndCooldown,
        });

        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel);
        } catch {
            await player.deleteQueue(inter.guildId);

            const NoVoiceEmbed = new EmbedBuilder()
                .setAuthor({ name: `I can't join the voice channel... try again?` })
                .setColor('#2f3136');

            return inter.editReply({ embeds: [NoVoiceEmbed] });
        }

        const playEmbed = new EmbedBuilder()
            .setAuthor({ name: `Loading your ${res.playlist ? 'playlist' : 'track'} to the queue...` })
            .setColor('#2f3136');

        await inter.editReply({ embeds: [playEmbed] });

        res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.isPlaying()) await queue.node.play();
    },
};
