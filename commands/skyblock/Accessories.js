//const { default: axios } = require('axios');
const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
//const nbt = require('prismarine-nbt');
//const fs = require('fs');
const { unzip } = require('node:zlib');
const { getMojangData, getHypixelData } = require('../../src/api');

module.exports = {
    name: 'accessories',
    description: "returns players accessories for the selected profile",
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

                //let fs = require('fs');
                let nbt = require('prismarine-nbt');

                //console.log(res.data.profiles[num].members[uuid].inventory.bag_contents.talisman_bag)
                accessory_data = playerProfile.members[uuid].inventory.bag_contents.talisman_bag.data;
                // var buffer = Buffer.from(accessory_data, 'base64');
                // unzip(buffer, (err, buffer) => {
                //     if (err) {
                //         console.error('An error occurred:', err);
                //         process.exitCode = 1;
                //     }
                //     console.log(buffer.toString());
                //     inter.editReply(buffer.toString().substring(0, 1999))
                // });

                //console.log(res.data.profiles)
                async function NBTparse(data) {
                    return new Promise((resolve, reject) => {
                        let buf = Buffer.from(data, 'base64');

                        nbt.parse(buf, (err, data) => {
                            if (err) {
                                //return console.error(err);
                                reject(err)
                                //console.log(JSON.stringify(data, null, 2));              
                                return;
                            }
                            resolve(data);
                        });
                    });
                }

                // async function parseAccessoryData(accessory_data) {
                //     try {
                //         const decoded_accessory_data = await NBTparse(accessory_data);
                //         //console.log("Decoded accessory data:", JSON.stringify(decoded_accessory_data, null, 2));
                //     } catch (err) {
                //         console.error("Error parsing data:", err);
                //     }
                // }

                //parseAccessoryData(accessory_data);

                const decoded_accessory_data = await NBTparse(accessory_data)
                //console.log(JSON.stringify(decoded_accessory_data, null, 2))
                const arrayed_data_repeats = decoded_accessory_data.value.i.value.value
                    .filter(item => Object.keys(item).length > 0)
                    .map(item => {
                        let texture = item.tag?.value?.SkullOwner?.value?.Properties?.value?.textures?.value?.value[0].Value.value
                        let decodedTexture = undefined
                        if (texture) {
                            decodedTexture = JSON.parse(atob(texture))
                            //console.log(decodedTexture)

                        }

                        return {
                            name: item.tag?.value.display.value.Name.value,
                            description: item.tag?.value.display.value.Lore.value.value,
                            texture: decodedTexture?.textures?.SKIN?.url,
                            rarity: item.tag?.value.display.value.Lore.value.value[item.tag?.value.display.value.Lore.value.value.length - 1 || 0]

                        };
                    });


                // function removeDuplicates(dataArray) {
                //     const uniqueItems = new Map();  // To store unique items by a chosen key (like name)
                //     dataArray.forEach(item => {
                //         if (!uniqueItems.has(item.name)) {  // Check if the name already exists in the map
                //             uniqueItems.set(item.name, item); // Add if it doesn't exist
                //         }
                //     });
                //     return Array.from(uniqueItems.values()); // Convert map back to array
                // }
                function removeDuplicates(dataArray) {
                    const uniqueItems = new Map(); // To store unique items by a normalized key
                
                    dataArray.forEach(item => {
                        // Normalize the name by removing non-alphabetic characters, trimming, and converting to lowercase
                        const normalizedName = item.name.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();
                
                        // Only add item if it doesn't exist in the map based on normalized name
                        if (!uniqueItems.has(normalizedName)) {
                            uniqueItems.set(normalizedName, item);
                        }
                    });
                
                    return Array.from(uniqueItems.values()); // Convert map back to array
                }

                const arrayed_data = removeDuplicates(arrayed_data_repeats);

                //console.log(arrayed_data)
                //console.log(arrayed_data[1].rarity)

                const maxPage = Math.ceil(arrayed_data.length / 20) + 1
                //console.log(maxPage, arrayed_data.length)
                function removeCharAndRandom(str, charToRemove) {
                    const regex = new RegExp(`${charToRemove}.`, 'g');
                    return str.replace(regex, '');
                }
                const AccessoryEmbed = new EmbedBuilder()
                    .setColor('#2f3136');
                if (page == 1) {
                    //common, uncommon, rare, epic, legenday, mythic, special, very special
                    let rartity_quant = [0, 0, 0, 0, 0, 0, 0, 0]
                    for (let i = 0; i < arrayed_data.length; i++) {
                        let rarity = removeCharAndRandom(arrayed_data[i].rarity, '§');
                        if (rarity == "UNCOMMON ACCESSORY") {
                            rartity_quant[1] += 1
                        } else if (rarity.includes("COMMON ACCESSORY")) {
                            rartity_quant[0] += 1
                        } else if (rarity.includes("RARE ACCESSORY") || rarity.includes("RARE DUNGEON ACCESSORY")) {
                            rartity_quant[2] += 1
                        } else if (rarity.includes("EPIC ACCESSORY") || rarity.includes("EPIC DUNGEON ACCESSORY")) {
                            rartity_quant[3] += 1
                        } else if (rarity.includes("LEGENDARY ACCESSORY")) {
                            rartity_quant[4] += 1
                        } else if (rarity.includes("MYTHIC ACCESSORY")) {
                            rartity_quant[5] += 1
                        } else if (rarity.includes("VERY SPECIAL ACCESSORY") || rarity.includes("VERY SPECIAL HATCESSORY")) {
                            rartity_quant[7] += 1
                        } else if (rarity.includes("SPECIAL ACCESSORY") || rarity.includes("SPECIAL HATCESSORY")) {
                            rartity_quant[6] += 1
                        } else {
                            console.log(rarity)
                        }
                    }
                    //console.log(rartity_quant)
                    let fullString = ''
                    const rarity = ["COMMON ACCESSORY", "UNCOMMON ACCESSORY", "RARE ACCESSORY", "EPIC ACCESSORY", "LEGENDARY ACCESSORY", "MYTHIC ACCESSORY", "SPECIAL ACCESSORY", "VERY SPECIAL ACCESSORY"]
                    for (let i = 0; i < 8; i++) {
                        fullString = fullString + (rarities[rarity[i]] || '') + rarity[i].charAt(0) + rarity[i].substring(1).toLowerCase() + ': ' + rartity_quant[i] + '\n'
                    }
                    let name = ('```ansi\n' + fullString + '\u001b[0;0m```')
                    AccessoryEmbed
                        .addFields(
                            { name: '\u200B', value: `Total accessories = ${+ arrayed_data.length}/122` },
                            { name: '\u200B', value: name },
                        )
                        .setTitle(`${player}'s Accessories on ${profile}`)
                        .setThumbnail(`https://mc-heads.net/body/${uuid}/left`)
                        .setAuthor({ name: `${player}`, iconURL: `https://mc-heads.net/avatar/${uuid}`, url: `https://namemc.com/profile/${uuid}` })
                        .setURL(`https://sky.shiiyu.moe/stats/${player}/${profile}`)
                } else {
                    let name = ''
                    //let fullString = ''
                    // for (let i = 0; i < 20; i++) {
                    //     // if (arrayed_data[i].texture) {
                    //     //     AccessoryEmbed.setImage('https://mc-heads.net/head/' + (arrayed_data[i].texture).split('/').pop());
                    //     // }
                    //     //console.log(arrayed_data[1].description)
                    //     // let fullString = ''
                    //     // for (item in arrayed_data[i].description) {
                    //     //     //console.log(item)
                    //     //     //console.log(arrayed_data[0]?.description[item])
                    //     //     if (arrayed_data[i]?.description[item] != '') {
                    //     //         const originalstring = arrayed_data[i].description[item]
                    //     //         if (item != arrayed_data[i].description.length - 1) {
                    //     //             //console.log(item)
                    //     //             //console.log(arrayed_data[i].description.length)
                    //     //             const modifiedString = removeCharAndRandom(originalstring, '§');
                    //     //             fullString = fullString + modifiedString + '\n'
                    //     //         } else {
                    //     //             const modifiedString = removeCharAndRandom(originalstring, '§');
                    //     //             fullString = fullString + (rarities[modifiedString] || '') + modifiedString + '\u001b[0;0m'
                    //     //         }
                    //     //     }
                    //     // }
                    //     //const colouredString = ('```ansi\n\u001b[0;34m' + fullString + '\u001b[0;0m```')
                    //     //const colouredString = ('```ansi\n' + fullString + '\u001b[0;0m```')
                    //     //console.log(colouredString)
                    //     let rarity = ''
                    //     if (((((page - 2) * 20) + i) < arrayed_data.length)) {
                    //         rarity = removeCharAndRandom(arrayed_data[i + ((page - 2) * 20)].rarity, '§')
                    //     }
                    //     //const name = '__'+ removeCharAndRandom(arrayed_data[i].name, '§') + '__'

                    //     //console.log(item)
                    //     //console.log(arrayed_data[0]?.description[item])
                    //     //const originalstring = arrayed_data[i].description[item]
                    //     if (i != 19 && ((((page - 2) * 20) + i) < arrayed_data.length)) {
                    //         //console.log(item)
                    //         //console.log(arrayed_data[i].description.length)
                    //         fullString = fullString + (rarities[rarity] || '') + removeCharAndRandom(arrayed_data[i + ((page - 2) * 20)].name, '§') + '\n'
                    //     } else if (i == 19 && ((((page - 2) * 20) + i) < arrayed_data.length)) {
                    //         //console.log(arrayed_data.length)
                    //         fullString = fullString + (rarities[rarity] || '') + removeCharAndRandom(arrayed_data[i + ((page - 2) * 20)].name, '§') + '\u001b[0;0m'
                    //     } else {
                    //         break;
                    //     }

                    //     //console.log(name)
                    //     //console.log(colouredString)
                    // }

                    const startIndex = (page - 2) * 20;
                    let fullString = [];

                    // Loop through the first 20 items (or less if data is shorter)
                    for (let i = 0; i < 20; i++) {
                        const index = startIndex + i;

                        // Check if the index is within bounds of arrayed_data
                        if (index < arrayed_data.length) {
                            let rarity = removeCharAndRandom(arrayed_data[index].rarity, '§').replace(/\ba\b/g, '').trim();
                            let name = removeCharAndRandom(arrayed_data[index].name, '§');

                            // Handle the first 19 items in the page
                            if (i !== 19) {
                                fullString.push((rarities[rarity] || '') + name + '\n');
                            } else {
                                // If it's the last item in the page, apply reset formatting
                                fullString.push((rarities[rarity] || '') + name + '\u001b[0;0m');
                            }
                        } else {
                            // Break if the index exceeds the length of the array
                            break;
                        }
                    }

                    // Join the parts into a single string with newlines between them
                    const finalString = fullString.join('');


                    name = ('```ansi\n' + finalString + '\u001b[0;0m```')
                    AccessoryEmbed.addFields({ name: '\u200b', value: name });
                }


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
                    //await inter.update({ embeds: [await embedMessage(page)], components: [row], ephemeral: true });
                    inter.update(/*'```ansi\n\u001b[0;31mhi\u001b[0;0m\n```'*/{ embeds: [AccessoryEmbed], components: [row], ephemeral: true })
                } catch (e) {
                    //console.log(e)
                    //await inter.editReply({ embeds: [await embedMessage(page)], components: [row], ephemeral: true });
                    inter.editReply(/*'```ansi\n\u001b[0;31mhi\u001b[0;0m\n```'*/{ embeds: [AccessoryEmbed], components: [row], ephemeral: true })
                }

            } catch (e) {
                console.log(e)
                inter.editReply('error')
            }

        },
    };

