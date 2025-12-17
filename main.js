// const { Player } = require('discord-player');
// const Genius = require("genius-lyrics");
// const { Client, GatewayIntentBits } = require('discord.js');
// const { YoutubeiExtractor, generateOauthTokens } = require('discord-player-youtubei');


// global.client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMembers,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.GuildVoiceStates,
//         GatewayIntentBits.MessageContent
//     ],
//     disableMentions: 'everyone',
// });

// client.config = require('./config');
// const player = new Player(client, client.config.opt.discordPlayer);
// global.genius = new Genius.Client();
// //player.extractors.loadDefault();
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

// require('./src/api')
// require('./src/loader');

// client.login(client.config.app.token);

import dotenv from 'dotenv';
dotenv.config({ path: '.env' })
console.log(process.env.DISCORD_TOKEN)
import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import Genius from 'genius-lyrics';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import config from './config.js';

console.log(`Starting bot process PID=${process.pid} at ${new Date().toISOString()}`);

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
    disableMentions: 'everyone',
});

global.client.config = config;
global.player = new Player(global.client, global.client.config.opt.discordPlayer);
global.genius = new Genius.Client();

await global.player.extractors.register(YoutubeiExtractor, {
    innertubeConfigRaw: {
        player_id: '0004de42',
    },
});
console.log('YoutubeiExtractor registered with default settings');


await import('./src/loader.js');

await global.client.login(global.client.config.app.token);
console.log(`Logged in as ${global.client.user.tag}!`);
