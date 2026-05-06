require('dotenv').config()
const Genius = require("genius-lyrics");
const { Client, GatewayIntentBits } = require('discord.js');
const { execFile } = require('child_process');
const path = require('path');
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

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

global.genius = new Genius.Client();

//require('./src/api')
require('./src/loader');

client.login(client.config.app.token);
