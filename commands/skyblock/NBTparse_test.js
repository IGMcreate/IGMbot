const { default: axios } = require('axios');
const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const {unzip} = require('node:zlib');

module.exports = {
    name: 'testparse',
    description: "nbt to plain text",
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


            item_data = AuctionData.auctions[0].item_bytes.data
            //console.log(item_data)
            let fs = require('fs');
            let nbt = require('prismarine-nbt');


            // var buffer = Buffer.from(accessory_data, 'base64');
            //         unzip(buffer, (err, buffer) => {
            //             if (err) {
            //               console.error('An error occurred:', err);
            //               process.exitCode = 1;
            //             }
            //             console.log(buffer.toString());
            //             inter.editReply(buffer.toString().substring(0, 1999))
            //           });

            // let item_data = [31, -117, 8, 0, 0, 0, 0, 0, 0, 0, -29, 98, 96, -32, 100, 96, -52, -28, 98, 96, 96, 80, 97, 98, 96, -54, 76, 97, 100, 98, 100, 96,
            //     117, -50, 47, -51, 43, 97, -28, 98, 96, 46, 73, 76, 103, 100, -32, 14, -51, 75, 42, 74, 77, -52, 78, 76, -54, 73, 101, 100, 102, -32, -12,
            //     -56, 76, 73, 117, -53, 73, 76, 47, 6, 106, -6, -57, -59, -64, -98, -110, 89, 92, -112, -109, 88, -55, -55, -64, -30, -109, 95, -108, -54, 1,
            //     20, 101, 97, -32, 57, -76, -36, 60, 32, -75, 40, 91, 33, -77, 36, 53, 23, 40, 34, 124, 104, -71, -91, -74, -71, -126, 99, 73, 73, 98, 114,
            //     -74, -126, 75, 98, 110, 98, 122, 42, 3, 31, 80, 16, -55, 108, 6, 6, 38, 6, 54, -88, 20, -120, 13, 114, 13, 43, 126, -41, -96, -24, -128, 0,
            //     -120, 62, 54, -104, 62, 5, 76, 21, -40, 1, 0, 111, 21, -87, 83, 10, 1, 0, 0];
            let buf = Buffer.from(item_data, 'base64');

            nbt.parse(buf, (err, data) => {
                if (err)
                    return console.error(err);

                console.log(JSON.stringify(data, null, 2));

            })


        } catch (e) { 
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