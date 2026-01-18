const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const Genius = require("genius-lyrics");
const { Client, GatewayIntentBits } = require('discord.js');
const { YoutubeiExtractor, generateOauthTokens } = require('discord-player-youtubei');
const { YoutubeSabrExtractor } = require('discord-player-googlevideo');


global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    disableMentions: 'everyone',
});

client.config = require('./config');
const player = new Player(client, client.config.opt.discordPlayer);
global.genius = new Genius.Client();
player.extractors.register(YoutubeSabrExtractor);
// player.extractors.register(YoutubeiExtractor, {
//     //authentication: client.config.app.access_token,
//     innertubeConfigRaw: {
//         player_id: '0004de42'
//     }
//     // streamOptions: {
//     //     useClient: "",
//     //     //useClient: "IOS"
//     //     //useClient: "WEB"
//     //     //useClient: "TV_EMBEDDED"
//     //     //useClient: "WEB_EMBEDDED",
//     // },
//     // generateWithPoToken: true,
// });
// console.log('YoutubeiExtractor registered with default settings');

//require('./src/api')
require('./src/loader');

client.login(client.config.app.token);
