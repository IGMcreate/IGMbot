const {
    getVoiceConnection
} = require('@discordjs/voice');

const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'loop',
    description: 'enable or disable looping of song\'s or the whole queue',
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description: 'what action you want to preform on the loop',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Queue', value: 'enable_loop_queue' },
                { name: 'Disable', value: 'disable_loop' },
                { name: 'Song', value: 'enable_loop_song' },
            ],
        }
    ],
    execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);
        const action = inter.options.getString('action');
        //console.log(action)
        let BaseEmbed = new EmbedBuilder()
            .setColor('#2f3136')

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        switch (action) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === 'typeQueue') return inter.editReply({ content: `Already looping the entire queue ${inter.member}... try again ? `, ephemeral: true });

                queue.repeatMode = 'typeQueue';

                BaseEmbed.setAuthor({ name: `Repeat mode enabled the whole queue will be repeated endlessly ` })

                return inter.editReply({ embeds: [BaseEmbed] });

            }
            case 'disable_loop': {
                if (queue.repeatMode === 'typeOff') return inter.editReply({ content: `Loop mode is already disabled ${inter.member}... try again ? `, ephemeral: true });

                queue.repeatMode = 'typeOff';

                BaseEmbed.setAuthor({ name: `Repeat mode disabled the queue will no longer be repeated ` })

                return inter.editReply({ embeds: [BaseEmbed] });

            }
            case 'enable_loop_song': {
                if (queue.repeatMode === 'typeTrack') return inter.editReply({ content: `Already looping the current song ${inter.member}... try again ? `, ephemeral: true });

                queue.repeatMode = 'typeTrack';

                BaseEmbed.setAuthor({ name: `Repeat mode enabled the current song will be repeated endlessly (you can end the loop with /loop disable)` })

                return inter.editReply({ embeds: [BaseEmbed] });

            }
        }

    },
};