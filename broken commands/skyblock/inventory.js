const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getMojangData, getHypixelData } = require('../../src/api');

module.exports = {
    name: 'inventory',
    description: "returns players inventory for the selected profile",
    options: [
        {
            name: 'player',
            description: "player whose profile's accessories are to be displayed",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'profile',
            description: 'profile to be displayed',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        }
    ],

    async autocomplete(inter, client) {
        const player = inter.options.getString('player');
        if (!player) return inter.respond([]); // No player input yet, return empty

        try {
            // Fetch the player's UUID from Mojang API
            const /*{ data: */mojangData /*}*/ = await getMojangData(player);//axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
            //console.log(mojangData)
            const uuid = mojangData.id;

            // Fetch the player's profiles from Hypixel SkyBlock API
            const hypixel_key = client.config.app.hypixel_api_token;
            const /*{ data: */hypixelData /*}*/ = await getHypixelData(uuid, hypixel_key);//axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`);

            if (!hypixelData.profiles || hypixelData.profiles.length === 0) {
                return inter.respond([{ name: 'No profiles found', value: 'none' }]);
            }

            // Prepare autocomplete choices based on available profiles
            const profileChoices = hypixelData.profiles.map(p => ({
                name: p.cute_name, // Displayed name
                value: p.cute_name.toLowerCase() // Value sent to the command
            }));

            inter.respond(profileChoices);
        } catch (error) {
            console.error(error);
            inter.respond([{ name: 'Error fetching profiles', value: 'none' }]);
        }
    },


        async execute({ inter, client, page = 1, playerREP, profileREP }) {
            let player = ''
            let profile = ''
            try {
                player = inter.options.getString('player') || playerREP;
                profile = (inter.options.getString('profile')).toLowerCase() || profileREP;
            } catch (e) {
                player = playerREP;
                profile = profileREP;
            }

            const hypixel_key = client.config.app.hypixel_api_token

            const rarities = {
                "COMMON ACCESSORY": '\u001b[1;37m',
                "UNCOMMON ACCESSORY": '\u001b[1;32m',
                "RARE ACCESSORY": '\u001b[1;34m',
                "EPIC ACCESSORY": '\u001b[1;35m',
                "LEGENDARY ACCESSORY": '\u001b[1;33m',
                "MYTHIC ACCESSORY": '\u001b[1;35m',
                "SPECIAL ACCESSORY": '\u001b[1;31m',
                "VERY SPECIAL ACCESSORY": '\u001b[1;31m',
                "RARE DUNGEON ACCESSORY": '\u001b[1;34m',
                "EPIC DUNGEON ACCESSORY": '\u001b[1;35m',
                "SPECIAL HATCESSORY": '\u001b[1;31m', 
                "VERY SPECIAL HATCESSORY": '\u001b[1;31m',
            };
            try {

                const /*{ data: */MojangData /*}*/ = await getMojangData(player);//axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
                const uuid = MojangData.id;
                const /*{ data: */HypixelData /*}*/ = await getHypixelData(uuid, hypixel_key);//axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`);

                if (!HypixelData.profiles || HypixelData.profiles.length === 0) {
                    return inter.editReply(`No profiles found for ${player}.`);
                }

                const playerProfile = HypixelData.profiles.find(p => p.cute_name.toLowerCase() === profile);
                if (!playerProfile) {
                    return inter.editReply(`No profile found with the name ${profile} for ${player}.`);
                }

                let nbt = require('prismarine-nbt');

                accessory_data = playerProfile.members[uuid].inventory.bag_contents.talisman_bag.data;
                async function NBTparse(data) {
                    return new Promise((resolve, reject) => {
                        let buf = Buffer.from(data, 'base64');

                        nbt.parse(buf, (err, data) => {
                            if (err) {
                                reject(err)         
                                return;
                            }
                            resolve(data);
                        });
                    });
                }

                const decoded_accessory_data = await NBTparse(accessory_data)
                const arrayed_data_repeats = decoded_accessory_data.value.i.value.value
                    .filter(item => Object.keys(item).length > 0)
                    .map(item => {
                        let texture = item.tag?.value?.SkullOwner?.value?.Properties?.value?.textures?.value?.value[0].Value.value
                        let decodedTexture = undefined
                        if (texture) {
                            decodedTexture = JSON.parse(atob(texture))

                        }

                        return {
                            name: item.tag?.value.display.value.Name.value,
                            description: item.tag?.value.display.value.Lore.value.value,
                            texture: decodedTexture?.textures?.SKIN?.url,
                            rarity: item.tag?.value.display.value.Lore.value.value[item.tag?.value.display.value.Lore.value.value.length - 1 || 0]

                        };
                    });

                function removeDuplicates(dataArray) {
                    const uniqueItems = new Map();
                
                    dataArray.forEach(item => {
                        const normalizedName = item.name.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();
                
                        if (!uniqueItems.has(normalizedName)) {
                            uniqueItems.set(normalizedName, item);
                        }
                    });
                
                    return Array.from(uniqueItems.values()); 
                }

                const arrayed_data = removeDuplicates(arrayed_data_repeats);

                const maxPage = Math.ceil(arrayed_data.length / 20) + 1
                function removeCharAndRandom(str, charToRemove) {
                    const regex = new RegExp(`${charToRemove}.`, 'g');
                    return str.replace(regex, '');
                }
                const AccessoryEmbed = new EmbedBuilder()
                    .setColor('#2f3136');
                


                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(JSON.stringify({ ffb: 'backwards', command: 'Accessories', pagenum: page - 1, player: player, profile: profile }))
                            .setLabel('Go back a page')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(JSON.stringify({ ffb: 'forward', command: 'Accessories', pagenum: page + 1, player: player, profile: profile }))
                            .setLabel('Go forward a page')
                            .setStyle(ButtonStyle.Success)
                    );
                if (page == 1) {
                    row.components[0].setDisabled(true);
                } else if (page == maxPage) {
                    row.components[1].setDisabled(true);
                } else {
                    row.components[0].setDisabled(false);
                    row.components[1].setDisabled(false);
                }

                AccessoryEmbed
                    .setTimestamp()
                    .setFooter({ text: 'page: ' + page, iconURL: inter.member.avatarURL({ dynamic: true }) });

                try {
                    inter.update({ embeds: [AccessoryEmbed], components: [row], ephemeral: true })
                } catch (e) {
                    inter.editReply({ embeds: [AccessoryEmbed], components: [row], ephemeral: true })
                }

            } catch (e) {
                console.log(e)
                inter.editReply('error')
            }

        },
    };

