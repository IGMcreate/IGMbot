// const { ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');

// module.exports = {
//     name: 'timeout',
//     description: "Timeouts target",
//     options: [
//         {
//             name: 'target',
//             description: 'person to timeout',
//             type: ApplicationCommandOptionType.User,
//             required: true,
//         },
//         {
//             name: 'time',
//             description: 'amount of time',
//             type: ApplicationCommandOptionType.Number,
//             required: true,
//         }
//     ],
//     async execute({ inter }) {
//         const time = inter.options.getNumber('time');
//         const member = inter.options.getMember('target');
//         if(!member.user.bot && (inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.ModerateMembers)||inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator))){
//         member.timeout(time);
//         inter.editReply(`Success!`)
//         } else
//         await inter.editReply(`You don't have the required permissions`)
//     },
// };
import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

export default {
    name: 'timeout',
    description: "Timeouts target",
    options: [
        {
            name: 'target',
            description: 'person to timeout',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'time',
            description: 'amount of time',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    async execute({ inter }) {
        const time = inter.options.getNumber('time');
        const member = inter.options.getMember('target');
        if (!member.user.bot && (inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.ModerateMembers) || inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator))) {
            member.timeout(time);
            inter.editReply(`Success!`);
        } else {
            await inter.editReply(`You don't have the required permissions`);
        }
    },
};