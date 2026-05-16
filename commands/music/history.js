const {
    getVoiceConnection
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../src/queueStore');

module.exports = {
    name: 'history',
    description: 'See the history of the queue',
    voiceChannel: false,

    async execute({ inter }) {

        const channel = inter.member.voice.channel;
        const connection = getVoiceConnection(channel.guild.id);
        if (!connection) return inter.editReply({ content: `Try playing a song first :) ${inter.member}`, ephemeral: true });
        const queue = getQueue(channel.guild.id, connection);

        if (!queue || queue.history.length == 0) return inter.editReply({ content: `No music has been played yet`, ephemeral: true });

        const tracks = queue.history;

        try {

            let description = (await Promise.all(tracks
                .slice(0, 20)
                .map(async (track, i) => {

                    let user = client.users.cache.get(track.user)

                    if (!user) {
                        try {
                            user = await client.users.fetch(track.user);
                        } catch {
                            user = { globalName: 'Unknown User' };
                        }
                    }

                    return `**${i + 1}.** [${track.title}](${track.url}) requested by ${user.globalName}`
                })))
                .join('\r\n');
            let HistoryEmbed = new EmbedBuilder()
                .setTitle(`History`)
                .setDescription(description)
                .setColor('#2f3136')
                .setTimestamp()
                .setFooter({ text: `Requested by ${inter.member.displayName}`, iconURL: inter.member.displayAvatarURL({ dynamic: true }) })


            inter.editReply({ embeds: [HistoryEmbed] });
        } catch (e) {
            console.log(e)
        }
    },
};
