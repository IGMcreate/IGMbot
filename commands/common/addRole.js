// const { ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');

// module.exports = {
//     name: 'role',
//     description: "Adds role to target",
//     options: [
//         {
//             name: 'target',
//             description: 'person to role',
//             type: ApplicationCommandOptionType.User,
//             required: true,
//         },
//         {
//             name: 'role',
//             description: 'role to add',
//             type: ApplicationCommandOptionType.Role,
//             required: true,
//         }
//     ],
//     async execute({ inter }) {
//         if(inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.ManageRoles)||inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator)){
//         const role = inter.options.getRole('role');
//         const member = inter.options.getMember('target');
//         member.roles.add(role);
//         inter.editReply(`Success!`)
//         } else
//         await inter.editReply(`You don't have the required permissions`)
//     },
// };
import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

export default {
    name: 'role',
    description: 'Adds role to target',
    options: [
        {
            name: 'target',
            description: 'person to role',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'role',
            description: 'role to add',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],
    async execute({ inter }) {
        const perms = inter.member.permissionsIn(inter.channel);
        if (perms.has(PermissionsBitField.Flags.ManageRoles) || perms.has(PermissionsBitField.Flags.Administrator)) {
            const role = inter.options.getRole('role');
            const member = inter.options.getMember('target');
            await member.roles.add(role);
            await inter.editReply('Success!');
        } else {
            await inter.editReply("You don't have the required permissions");
        }
    },
};