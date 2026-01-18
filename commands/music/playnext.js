const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    name: 'playnext',
    description: "song you want to playnext",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'the song you want to playnext',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'position',
            description: 'the position to add the song',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer()

        const queue = useQueue(inter.guild);
        var position = inter.options.getString('position') ? inter.options.getString('position') - 1 : 0
        if (!queue || !queue.isPlaying()) return inter.editReply({ content: `No music currently playing ${inter.member}... try again ? `, ephemeral: true });

        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return inter.editReply({ content: `No results found ${inter.member}... try again ? `, ephemeral: true });

        if (res.playlist) return inter.editReply({ content: `This command dose not support playlist's ${inter.member}... try again ? `, ephemeral: true });

        queue.insertTrack(res.tracks[0], position)

        const PlayNextEmbed = new EmbedBuilder()
            .setAuthor({ name: `Track has been inserted into the queue... it will play next ` })
            .setColor('#2f3136')

        await inter.editReply({ embeds: [PlayNextEmbed] });


    }
}
