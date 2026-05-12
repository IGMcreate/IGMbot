const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'debug',
    description: "Abuse this and i'll be very sad :(",
    showHelp: false,

    execute({ client, inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        const queue = getQueue(channel.guild.id, connection);

        console.log(inter);
        console.log('\n-----------------------------\n');
        console.log(client);
        console.log('\n-----------------------------\n');
        console.log(queue);
        console.log('\n-----------------------------\n');
        console.log(queue.playing);
        console.log(queue.current);
    },
};
