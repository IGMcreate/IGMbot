// const { EmbedBuilder, InteractionType } = require('discord.js');
// const { useQueue } = require('discord-player');

// module.exports = async (client, inter) => {
//     await inter.deferReply()
//     if (inter.type === InteractionType.ApplicationCommand) {
//         const DJ = client.config.opt.DJ;
//         const command = client.commands.get(inter.commandName);


//     if (!command) return inter.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription('Error!')], ephemeral: true, }), client.slash.delete(inter.commandName)
//     if (command.permissions && !inter.member.permissions.has(command.permissions)) return inter.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`You need do not have the proper permissions to exacute this command`)], ephemeral: true, })
//     if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) return inter.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`This command is reserved For members with \`${DJ.roleName}\` `)], ephemeral: true, })
//     if (command.voiceChannel) {
//             if (!inter.member.voice.channel) return inter.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in a Voice Channel`)], ephemeral: true, })
//             if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) return inter.editReply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in the same Voice Channel`)], ephemeral: true, })
//        }
//         command.execute({ inter, client });
//     }
//     if (inter.type === InteractionType.MessageComponent) {
//         const customId = JSON.parse(inter.customId)
//         const file_of_button = customId.ffb
// const queue = useQueue(inter.guild);
//         if (file_of_button) {
//             delete require.cache[require.resolve(`../../src/buttons/${file_of_button}.js`)];
//             const button = require(`../../src/buttons/${file_of_button}.js`)
//             if (button) return button({ client, inter, customId, queue });
//         }
//     }
// };

// const { EmbedBuilder, InteractionType } = require('discord.js');
// const { useQueue } = require('discord-player');

// module.exports = async (client, inter) => {
//     // Handle application command interactions
//     if (inter.type === InteractionType.ApplicationCommand) {
//         await inter.deferReply();

//         const DJ = client.config.opt.DJ;
//         const command = client.commands.get(inter.commandName);

//         if (!command) return inter.editReply({ 
//             embeds: [new EmbedBuilder().setColor('#ff0000').setDescription('Error!')], 
//             ephemeral: true 
//         }), client.slash.delete(inter.commandName);

//         if (command.permissions && !inter.member.permissions.has(command.permissions)) {
//             return inter.editReply({ 
//                 embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You do not have the proper permissions to execute this command`)],
//                 ephemeral: true 
//             });
//         }

//         if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
//             return inter.editReply({ 
//                 embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`This command is reserved for members with \`${DJ.roleName}\``)], 
//                 ephemeral: true 
//             });
//         }

//         if (command.voiceChannel) {
//             if (!inter.member.voice.channel) {
//                 return inter.editReply({ 
//                     embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in a voice channel`)], 
//                     ephemeral: true 
//                 });
//             }

//             if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
//                 return inter.editReply({ 
//                     embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in the same voice channel`)], 
//                     ephemeral: true 
//                 });
//             }
//         }

//         // Execute the command
//         command.execute({ inter, client });
//     }

//     // Handle button interactions
//     if (inter.type === InteractionType.MessageComponent) {
//         await inter.deferReply();
//         const customId = JSON.parse(inter.customId);
//         const file_of_button = customId.ffb;
//         const queue = useQueue(inter.guild);

//         if (file_of_button) {
//             delete require.cache[require.resolve(`../../src/buttons/${file_of_button}.js`)];
//             const button = require(`../../src/buttons/${file_of_button}.js`);
//             if (button) return button({ client, inter, customId, queue });
//         }
//     }

//     // Handle autocomplete interactions
//     if (inter.type === InteractionType.ApplicationCommandAutocomplete) {
//         const command = client.commands.get(inter.commandName);
//         if (command && command.autocomplete) {
//             command.autocomplete(inter, client);  // Handle autocomplete suggestions
//         }
//     }
// };


const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');

const ignoredButtonIds = ['backwards', 'forward'];

module.exports = async (client, inter) => {
    // Handle application command interactions
    if (inter.type === InteractionType.ApplicationCommand) {
        await inter.deferReply();

        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

        if (!command) return inter.editReply({
            embeds: [new EmbedBuilder().setColor('#ff0000').setDescription('Error!')],
            ephemeral: true
        }), client.slash.delete(inter.commandName);

        if (command.permissions && !inter.member.permissions.has(command.permissions)) {
            return inter.editReply({
                embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You do not have the proper permissions to execute this command`)],
                ephemeral: true
            });
        }

        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            return inter.editReply({
                embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`This command is reserved for members with \`${DJ.roleName}\``)],
                ephemeral: true
            });
        }

        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                return inter.editReply({
                    embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in a voice channel`)],
                    ephemeral: true
                });
            }

            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                return inter.editReply({
                    embeds: [new EmbedBuilder().setColor('#ff0000').setDescription(`You are not in the same voice channel`)],
                    ephemeral: true
                });
            }
        }

        // Execute the command
        command.execute({ inter, client });
    }

    // Handle button interactions
    if (inter.type === InteractionType.MessageComponent) {
        const customId = JSON.parse(inter.customId);
        const file_of_button = customId.ffb;

        // if (ignoredButtonIds.includes(customId.ffb)) {
        //     return; // Skip handling this button
        // }

        if (customId.command == 'Mayor') {
            let page = customId.pagenum || 1;
            const mayorCommand = require('../../commands/skyblock/Mayor.js');
            mayorCommand.execute({ inter, client, page });
        }

        if (customId.command == 'Accessories') {
            let page = customId.pagenum || 1;
            let playerREP = customId.player || '';
            let profileREP = customId.profile || '';
            const AccessoriesCommand = require('../../commands/skyblock/Accessories.js');
            AccessoriesCommand.execute({ inter, client, page, playerREP, profileREP });
        }

        const queue = useQueue(inter.guild);

        if (file_of_button && !customId.command) {
            await inter.deferReply();
            delete require.cache[require.resolve(`../../src/buttons/${file_of_button}.js`)];
            const button = require(`../../src/buttons/${file_of_button}.js`);
            if (button) return button({ client, inter, customId, queue });
        }
    }

    // Handle autocomplete interactions
    if (inter.type === InteractionType.ApplicationCommandAutocomplete) {
        const command = client.commands.get(inter.commandName);
        if (command && command.autocomplete) {
            command.autocomplete(inter, client);  // Handle autocomplete suggestions
        }
    }
};
