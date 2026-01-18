const { ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');

module.exports = {
    name: 'unrole',
    description: "Removes role from target",
    options: [
        {
            name: 'target',
            description: 'person to unrole',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'role',
            description: 'role to remove',
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],
    async execute({inter}) {
        if(inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.ManageRoles)||inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator)){
        const role = inter.options.getRole('role');
        const member = inter.options.getMember('target');
        member.roles.remove(role);
        inter.editReply(`Success!`)
        } else
        await inter.editReply(`You don't have the required permissions`)
    },
};
