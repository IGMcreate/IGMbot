// const { EmbedBuilder } = require('discord.js');

// module.exports = {
//     name: 'help',
//     description: "All the commands this bot has!",
//     showHelp: false,

//     execute({ client, inter }) {
//         const commands = client.commands.filter(x => x.showHelp !== false);

//         const embed = new EmbedBuilder()
//         .setColor('#ff0000')
//         .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
//         .setDescription('')
//         .addFields([ { name: `Enabled - ${commands.size}`, value: commands.map(x => `\`${x.name}\``).join(' | ') } ])
//         .setTimestamp()
//         .setFooter({ text: '', iconURL: inter.member.avatarURL({ dynamic: true })});

//         inter.editReply({ embeds: [embed] });
//     },
// };
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'help',
    description: "All the commands this bot has!",
    showHelp: false,

    async execute({ inter }) {
        // Filter commands that should be shown
        const commands = global.client.commands.filter(cmd => cmd.showHelp !== false);

        // Build the embed
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setAuthor({
                name: global.client.user?.username || 'Bot',
                iconURL: global.client.user?.displayAvatarURL({ size: 1024, dynamic: true })
            })
            .setDescription('\u200B')
            .addFields([
                {
                    name: `Enabled - ${commands.size}`,
                    value: commands.map(cmd => `\`${cmd.name}\``).join(' | ') || 'No commands available'
                }
            ])
            .setTimestamp()
            .setFooter({
                text: ':)',
                iconURL: inter.member?.avatarURL({ dynamic: true }) || undefined
            });

        // Send the embed
        await inter.editReply({ embeds: [embed] });
    },
};
