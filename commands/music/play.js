const {
    joinVoiceChannel,
    getVoiceConnection
} = require('@discordjs/voice');

const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'play',
    description: "play a song!",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'song or url',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const query = inter.options.getString('song');
        const channel = inter.member.voice.channel;

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        connection.on('debug', console.log);

        const queue = getQueue(channel.guild.id, connection);
        queue.textChannel = inter.channel;
        //await queue.testYTDLP(query);
        await queue.add(query, 'end');
        // await testVoice(inter.member.voice.channel);
        // return;

        return inter.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Added to queue` })
                    .setColor('#2f3136')
            ]
        });
    }
};