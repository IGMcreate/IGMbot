const {
    getVoiceConnection
} = require('@discordjs/voice');

const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'remove',
    description: "remove a song from the queue",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'the name/url of the track you want to remove',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description: 'the place in the queue the song is in',
            type: ApplicationCommandOptionType.Number,
            required: false,
            minValue: 1
        }
    ],

    async execute({ inter }) {
        const number = inter.options.getNumber('number')
        const track = inter.options.getString('song');
        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || !queue.playing) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });
        if (!track && !number) inter.editReply({ content: `You have to use one of the options to remove a song ${inter.member}... try again ? `, ephemeral: true });

        const BaseEmbed = new EmbedBuilder()
            .setColor('#2f3136')


        if (track) {
            clean_url = (url) => url.replace(/^(https?:\/\/)?(www\.)?/, '')
            const track_to_remove = queue.queue.find((t) => t.title.toLowerCase() === track.toLowerCase() || clean_url(t.url) === clean_url(track));
            if (!track_to_remove) return await inter.editReply({ content: `could not find ${track} ${inter.member}... try using the url or the full name of the song ? `, ephemeral: true });
            queue.removeTrack(track_to_remove);
            BaseEmbed.setAuthor({ name: `removed ${track_to_remove.title} from the queue ` })

            return await inter.editReply({ embeds: [BaseEmbed] });
        }

        if (number) {

            const index = number - 1
            const trackname = queue.queue[index]?.title;
            //const trackname = queue.tracks.toArray()[index].title

            if (!trackname) return await inter.editReply({ content: `This track does not seem to exist ${inter.member}...  try again ?`, ephemeral: true });

            queue.removeTrack(queue.queue[index]);

            BaseEmbed.setAuthor({ name: `removed ${trackname} from the queue ` })

            return inter.editReply({ embeds: [BaseEmbed] });
        }



    }
}
