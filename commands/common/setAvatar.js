// const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder} = require('discord.js');

// module.exports = {
//     name: 'setavatar',
//     description: "Sets the avatar to a URL or path",
//     options: [
//         {
//             name: 'image',
//             description: 'placeholder',
//             type: ApplicationCommandOptionType.Attachment,
//             required: true,
//         }
//     ],
//     async execute({ client, inter }) {
//         const image = inter.options.getAttachment('image');
//         const avatar = image.url;


//         if(inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator)){
//             const changed = await client.user.setAvatar(avatar).catch(err =>{
//                 inter.editReply({content:`Error: ${err}` , ephemeral:true});
//             });


//             if(changed) {
//                 const embed = new EmbedBuilder()
//                 .setColor("Blue")
//                 .setDescription(`Avatar is set to: \`${avatar}\``)
    
//                 await inter.editReply({embeds: [embed], ephemeral: true});    
//             } else {
//                 return;
//             }

//         } else {
//             await inter.editReply(`You don't have the required permissions`)
//         }

//     },
// };
import { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } from 'discord.js';

export default {
    name: 'setavatar',
    description: "Sets the avatar to a URL or path",
    options: [
        {
            name: 'image',
            description: 'placeholder',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        }
    ],
    async execute({ client, inter }) {
        const image = inter.options.getAttachment('image');
        if (!image) return inter.editReply({ content: 'No image provided', ephemeral: true });

        const avatar = image.url;

        if (!inter.member.permissionsIn(inter.channel).has(PermissionsBitField.Flags.Administrator)) {
            return inter.editReply({ content: "You don't have the required permissions", ephemeral: true });
        }

        try {
            const changed = await client.user.setAvatar(avatar);
            if (changed) {
                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setDescription(`Avatar is set to: \`${avatar}\``);

                await inter.editReply({ embeds: [embed], ephemeral: true });
            }
        } catch (err) {
            await inter.editReply({ content: `Error: ${err.message || err}`, ephemeral: true });
        }
    },
};