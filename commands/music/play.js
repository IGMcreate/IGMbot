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
        const currentTracks = await queue.add(query, 'end', inter);
        
        return inter.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: currentTracks.length == 1 ? `Added ${currentTracks[0].title} to the queue` : `Added ${currentTracks[0].title} + ${currentTracks.length - 1} other songs to the queue` })
                    .setColor('#2f3136')
            ]
        });
    }
};