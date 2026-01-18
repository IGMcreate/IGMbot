const { default: axios } = require('axios');
const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'auctions',
    description: "Shows players current auctions",
    options: [
        {
            name: 'player',
            description: 'player whose auctions are to be checked',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'profile',
            description: 'Profile to be displayed',
            type: ApplicationCommandOptionType.String,
            required: true,
            //autocomplete: true // Enable autocomplete for profile selection
        }
    ],
    async execute({ inter }) {
        const player = inter.options.getString('player');
        const profile = (inter.options.getString('profile')).toLowerCase();

        const hypixel_key = client.config.app.hypixel_api_token

        try {

            const { data: MojangData } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
            const uuid = MojangData.id;
            const { data: HypixelData } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`)


            if (!HypixelData.profiles || HypixelData.profiles.length === 0) {
                return inter.editReply(`No profiles found for ${player}.`);
            }

            const playerProfile = HypixelData.profiles.find(p => p.cute_name.toLowerCase() === profile);
            if (!playerProfile) {
                return inter.editReply(`No profile found with the name ${profile} for ${player}.`);
            }

            const { data: AuctionData } = await axios.get(`https://api.hypixel.net/v2/skyblock/auction?key=${hypixel_key}&profile=${playerProfile.profile_id}`)

            if (AuctionData.auctions[0] === undefined) {
                return inter.editReply(`No current auctions`);
            }


            function removeCharAndRandom(str, charToRemove) {
                // Create a regular expression to match the specified character followed by any character
                const regex = new RegExp(`${charToRemove}.`, 'g');

                // Use the replace method to remove the matched substring
                return str.replace(regex, '');
            }

            const file = new AttachmentBuilder('../Broken af/assets/discordjs.jpg');
            const AuctionsEmbed = new EmbedBuilder()
                .setColor('#2f3136')
                .setURL(`https://sky.coflnet.com/player/${player}`)
                .setAuthor({ name: `${player}`, iconURL: `https://mc-heads.net/avatar/${uuid}`, url: `https://namemc.com/profile/${uuid}` })
                .setTitle('Auctions')
                .setThumbnail(`https://mc-heads.net/body/${uuid}/left`)
                .setDescription(`Player ${player}'s auctions`)
                .addFields(
                    { name: 'Item name', value: AuctionData.auctions[0].item_name },
                    //{ name: '\u200B', value: '\u200B' },
                )
                const originalString = AuctionData.auctions[0].item_lore;
                const modifiedString = removeCharAndRandom(originalString, '§');
                AuctionsEmbed.addFields(
                    { name: 'Item description', value: modifiedString, inline: true }
                )
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                    //{ name: 'Inline field title', value: 'Some value here', inline: true },
                //)
                AuctionsEmbed
                .setImage('attachment://discordjs.jpg')
                //.setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'a', iconURL: inter.member.avatarURL({ dynamic: true }) })
            inter.editReply({ embeds: [AuctionsEmbed], files: [file] })


        } catch (e){
            console.log(e)
            inter.editReply('error')
        }



        // function axiosUUID() {
        //     const promise = axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`)

        //     const dataPromise = promise.then((res) => res.data.id)

        //     return dataPromise
        // }

        // axiosUUID()
        //     .then(data => {
        //         axios
        //         .get(`https://api.hypixel.net/skyblock/auction?key=${hypixel_key}&player=${data}`)
        //         .then((res) => {

        //             //console.log('Res:', res.data.auctions[0])

        //             if (res.data.auctions[0] === undefined) return inter.editReply(`No current auctions`);

        //             const file = new AttachmentBuilder('../Broken af/assets/discordjs.jpg');
        //             const AuctionsEmbed = new EmbedBuilder()
        //             .setColor('#2f3136')
        //             .setURL(`https://sky.coflnet.com/player/${player}`)
        //             .setAuthor({ name: `${player}`, iconURL: `https://mc-heads.net/avatar/${data}` , url: `https://namemc.com/profile/${data}`  })
        //             .setTitle('Auctions')
        //             .setThumbnail(`https://mc-heads.net/body/${data}/left`)
        //             .setDescription('Some description here')
        //             .addFields(
        //                 { name: 'Regular field title', value: 'Some value here' },
        //                 { name: '\u200B', value: '\u200B' },
        //                 { name: 'Inline field title', value: 'Some value here', inline: true },
        //                 { name: 'Inline field title', value: 'Some value here', inline: true },
        //             )
        //             .setImage('attachment://discordjs.jpg')
        //             //.setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
        //             .setTimestamp()
        //             .setFooter({ text: 'a', iconURL: inter.member.avatarURL({ dynamic: true })})
        //             inter.editReply({ embeds: [AuctionsEmbed], files: [file] })

        //         })
        //     })
        //     .catch(err => console.log(err))

        // .catch(console.error);//might crash .exe, needs testing

    },
};