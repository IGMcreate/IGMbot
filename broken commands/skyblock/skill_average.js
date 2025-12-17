// // const { default: axios } = require('axios');
// // const { ApplicationCommandOptionType} = require('discord.js');
// // //const test = require(`../../TBF/Dungeoneering_exp.js`);

// // module.exports = {
// //     name: 'skillaverage',
// //     description: "returns players accessories for the selected profile",
// //     options: [
// //         {
// //             name: 'player',
// //             description: "player whose profile's accessories are to be displayed",
// //             type: ApplicationCommandOptionType.String,
// //             required: true,
// //         },
// //         {
// //             name: 'profile',
// //             description: 'profile to be displayed',
// //             type: ApplicationCommandOptionType.String,
// //             required: true,
// //         }
// //     ],
// //     async execute({inter, client}) {
// //         const player = inter.options.getString('player');
// //         const profile = (inter.options.getString('profile')).toLowerCase();

// //         const hypixel_key = client.config.app.hypixel_api_token

// //         function axiosUUID() {
// //             const promise = axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`)
            
// //             const dataPromise = promise.then((res) => res.data.id)
            
// //             return dataPromise
// //         }
        
// //         axiosUUID()
// //         .then(data => {
// //             axios
// //             .get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${data}`)
// //                 .then((res) => {
// //                     const uuid = data
// //                     if (res.data.profiles[0] === undefined) return inter.editReply(`No profiles exist`);

// //                     var datas = res.data.profiles;
// //                     for (var i = 0; i < datas.length; i++) {
// //                         let type = datas[i].cute_name.toLowerCase();
                        
// //                         if (type === profile) {
// //                             var num = i
// //                             break;
// //                         }                         
// //                     }
// //                     axios
// //                     .get(`https://api.hypixel.net/v2/resources/skyblock/skills`)
// //                     .then((res2) => {
                        
// //                         const exp_array = [
// //                             0,
// //                             50,
// //                             125,
// //                             235,
// //                             395,
// //                             625,
// //                             955,
// //                             1425,
// //                             2095,
// //                             3045,
// //                             4385,
// //                             6275,
// //                             8940,
// //                             12700,
// //                             17960,
// //                             25340,
// //                             35640,
// //                             50040,
// //                             70040,
// //                             97640,
// //                             135640,
// //                             188140,
// //                             259640,
// //                             356640,
// //                             488640,
// //                             668640,
// //                             911640,
// //                             1239640,
// //                             1684640,
// //                             2284640,
// //                             3084640,
// //                             4149640,
// //                             5559640,
// //                             7459640,
// //                             9959640,
// //                             13259640,
// //                             17559640,
// //                             23159640,
// //                             30359640,
// //                             39559640,
// //                             51559640,
// //                             66559640,
// //                             85559640,
// //                             109559640,
// //                             139559640,
// //                             177559640,
// //                             225559640,
// //                             285559640,
// //                             360559640,
// //                             453559640,
// //                             569809640,
// //                             ];
                            
// //                         var Skill_total = 0

// //                         var datas2 = res2.data.skills.FARMING.levels;
// //                         Breakpoint:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired
// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_FARMING) {
// //                                 //console.log(res.data.profiles[num].members[uuid].player_data.experience.SKILL_FARMING)
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_FARMING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Farming_level = j + current_level_progress_decimal
                                
// //                                 Skill_total += Farming_level
// //                                 console.log(`Farming: ${Farming_level}`)
// //                                 break Breakpoint;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.MINING.levels;
// //                         Breakpoint2:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_MINING) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_MINING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Mining_level = j + current_level_progress_decimal

// //                                 Skill_total += Mining_level
// //                                 console.log(`Mining: ${Mining_level}`)
// //                                 break Breakpoint2;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.COMBAT.levels;
// //                         Breakpoint3:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_COMBAT) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_COMBAT - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Combat_level = j + current_level_progress_decimal

// //                                 Skill_total += Combat_level
// //                                 console.log(`Combat: ${Combat_level}`)
// //                                 break Breakpoint3;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.FORAGING.levels;
// //                         Breakpoint4:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_FORAGING) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_FORAGING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Foraging_level = j + current_level_progress_decimal

// //                                 Skill_total += Foraging_level
// //                                 console.log(`Foraging: ${Foraging_level}`)
// //                                 break Breakpoint4;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.FISHING.levels;
// //                         Breakpoint5:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_FISHING) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_FISHING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Fishing_level = j + current_level_progress_decimal

// //                                 Skill_total += Fishing_level
// //                                 console.log(`Fishing: ${Fishing_level}`)
// //                                 break Breakpoint5;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.ENCHANTING.levels;
// //                         Breakpoint6:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_ENCHANTING) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_ENCHANTING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Enchanting_level = j + current_level_progress_decimal

// //                                 Skill_total += Enchanting_level
// //                                 console.log(`Enchanting: ${Enchanting_level}`)
// //                                 break Breakpoint6;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.ALCHEMY.levels;
// //                         Breakpoint7:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_ALCHEMY) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_ALCHEMY - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Alchemy_level = j + current_level_progress_decimal

// //                                 Skill_total += Alchemy_level
// //                                 console.log(`Alchemy: ${Alchemy_level}`)
// //                                 break Breakpoint7;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.CARPENTRY.levels;
// //                         Breakpoint8:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_CARPENTRY) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_CARPENTRY - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Carpentry_level = j + current_level_progress_decimal

// //                                 Skill_total += Carpentry_level
// //                                 console.log(`Carpentry: ${Carpentry_level}`)
// //                                 break Breakpoint8;
// //                             }

// //                         }

// //                         var datas2 = res2.data.skills.TAMING.levels;
// //                         Breakpoint9:
// //                         for (var j = 0; j < datas2.length; j++) {
// //                             let type2 = datas2[j].totalExpRequired

// //                             if (type2 > res.data.profiles[num].members[uuid].player_data.experience.SKILL_TAMING) {
// //                                 let type3 = datas2[j - 1].totalExpRequired
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].player_data.experience.SKILL_TAMING - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Taming_level = j + current_level_progress_decimal

// //                                 Skill_total += Taming_level
// //                                 console.log(`Taming: ${Taming_level}`)
// //                                 break Breakpoint9;
// //                             }

// //                         }

// //                         // var datas2 = res2.data.skills.FARMING.levels;
// //                         Breakpoint10:
// //                         for (var j = 0; j < exp_array.length; j++) {
// //                             let type2 = exp_array[j]
        
// //                             if (type2 > res.data.profiles[num].members[uuid].dungeons.dungeon_types.catacombs.experience) {
// //                                 let type3 = exp_array[j - 1]
// //                                 let level_exp = type2 - type3
// //                                 let current_level_progress = res.data.profiles[num].members[uuid].dungeons.dungeon_types.catacombs.experience - type3
// //                                 let current_level_progress_decimal = current_level_progress / level_exp
// //                                 const Dungeons_level = (j - 1) + current_level_progress_decimal
// //                                 Skill_total += Dungeons_level
// //                                 console.log(`Dungeons: ${Dungeons_level}`)
// //                                 break Breakpoint10;
// //                             }
        
// //                         }


                        
                        
// //                         //const Skill_total = Farming_level + Mining_level + Combat_level + Foraging_level + Fishing_level + Enchanting_level +Alchemy_level + Carpentry_level + Taming_level //+ Dungeon_level
// //                         const Skill_average = (Skill_total / 10).toFixed(2)
// //                         console.log(Skill_average)
                        
// //                         if (Skill_average != 0){
// //                             inter.editReply(`${player}: ` + (Skill_average).toString())
// //                         }  else {
// //                             inter.editReply(`${player} has their Skill Api Disabled`)
// //                         }

// //                         //console.log((res.data.profiles[num].members[uuid]))
// //                     })
// //                 })
// //             })
// //             .catch(err => console.log(err))

// //         .catch(console.error);//might crash .exe, needs testing
// //     }, 
// // };
// const { default: axios } = require('axios');
// const { ApplicationCommandOptionType } = require('discord.js');

// module.exports = {
//     name: 'skillaverage',
//     description: "Returns player's skill average for the selected profile",
//     options: [
//         {
//             name: 'player',
//             description: "Player whose profile's skill average is to be displayed",
//             type: ApplicationCommandOptionType.String,
//             required: true,
//         },
//         {
//             name: 'profile',
//             description: 'Profile to be displayed',
//             type: ApplicationCommandOptionType.String,
//             required: true,
//         }
//     ],
//     async execute({ inter, client }) {
//         const player = inter.options.getString('player');
//         const profile = inter.options.getString('profile').toLowerCase();
//         const hypixel_key = client.config.app.hypixel_api_token;

//         // Helper function to calculate skill level based on experience
//         function calculateSkillLevel(skillData, playerExp) {
//             for (let i = 0; i < skillData.length; i++) {
//                 if (skillData[i].totalExpRequired > playerExp) {
//                     const prevLevelExp = skillData[i - 1]?.totalExpRequired || 0;
//                     const levelExp = skillData[i].totalExpRequired - prevLevelExp;
//                     const currentLevelProgress = playerExp - prevLevelExp;
//                     return i + currentLevelProgress / levelExp;
//                 }
//             }
//             return skillData.length; // Max level if experience exceeds last level
//         }

//         try {
//             // Fetch the player's UUID from Mojang API
//             const { data: mojangData } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
//             const uuid = mojangData.id;

//             // Fetch the player's profiles from Hypixel SkyBlock API
//             const { data: hypixelData } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`);

//             if (!hypixelData.profiles || hypixelData.profiles.length === 0) {
//                 return inter.editReply(`No profiles found for ${player}.`);
//             }

//             // Find the correct profile by profile name
//             const playerProfile = hypixelData.profiles.find(p => p.cute_name.toLowerCase() === profile);
//             if (!playerProfile) {
//                 return inter.editReply(`No profile found with the name ${profile} for ${player}.`);
//             }

//             const memberData = playerProfile.members[uuid].player_data?.experience;
//             if (!memberData) {
//                 return inter.editReply(`${player} has their Skill API disabled.`);
//             }

//             // Fetch skill requirements from Hypixel resources API
//             const { data: skillResources } = await axios.get('https://api.hypixel.net/v2/resources/skyblock/skills');

//             // Calculate skill averages for each skill
//             const skills = [
//                 { name: 'Farming', key: 'SKILL_FARMING' },
//                 { name: 'Mining', key: 'SKILL_MINING' },
//                 { name: 'Combat', key: 'SKILL_COMBAT' },
//                 { name: 'Foraging', key: 'SKILL_FORAGING' },
//                 { name: 'Fishing', key: 'SKILL_FISHING' },
//                 { name: 'Enchanting', key: 'SKILL_ENCHANTING' },
//                 { name: 'Alchemy', key: 'SKILL_ALCHEMY' },
//                 { name: 'Carpentry', key: 'SKILL_CARPENTRY' },
//                 { name: 'Taming', key: 'SKILL_TAMING' },
//             ];

//             let skillTotal = 0;

//             for (const skill of skills) {
//                 const playerExp = memberData[skill.key];
//                 if (playerExp !== undefined) {
//                     const skillLevels = skillResources.skills[skill.name.toUpperCase()].levels;
//                     const skillLevel = calculateSkillLevel(skillLevels, playerExp);
//                     skillTotal += skillLevel;
//                     console.log(`${skill.name}: ${skillLevel}`);
//                 } else {
//                     console.log(`${skill.name}: Not found in player data`);
//                 }
//             }

//             // Special case for Dungeons (uses a different system)
//             const dungeonExpArray = [
//                 0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640,
//                 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640,
//                 13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640,
//                 360559640, 453559640, 569809640,
//             ];

//             const dungeonExp = playerProfile.members[uuid].dungeons?.dungeon_types?.catacombs?.experience || 0;
//             const dungeonLevel = calculateSkillLevel(dungeonExpArray.map(totalExpRequired => ({ totalExpRequired })), dungeonExp);
//             skillTotal += dungeonLevel;
//             console.log(`Dungeons: ${dungeonLevel}`);

//             // Calculate and send the skill average
//             const skillAverage = (skillTotal / 10).toFixed(2);
//             inter.editReply(`${player}: Skill average is ${skillAverage}`);
//         } catch (error) {
//             console.error(error);
//             inter.editReply('An error occurred while fetching skill data. Please try again later.');
//         }
//     },
// };

const { default: axios } = require('axios');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'skillaverage',
    description: "Returns player's skill average for the selected profile",
    options: [
        {
            name: 'player',
            description: "Player whose profile's skill average is to be displayed",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'profile',
            description: 'Profile to be displayed',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true // Enable autocomplete for profile selection
        }
    ],
    
    // Autocomplete interaction for profile selection
    async autocomplete(inter, client) {
        const player = inter.options.getString('player');
        if (!player) return inter.respond([]); // No player input yet, return empty

        try {
            // Fetch the player's UUID from Mojang API
            const { data: mojangData } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
            const uuid = mojangData.id;

            // Fetch the player's profiles from Hypixel SkyBlock API
            const hypixel_key = client.config.app.hypixel_api_token;
            const { data: hypixelData } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`);

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
    
    // Main command execution
    async execute({ inter, client }) {
        const player = inter.options.getString('player');
        const profile = inter.options.getString('profile').toLowerCase();
        const hypixel_key = client.config.app.hypixel_api_token;

        // Helper function to calculate skill level based on experience
        function calculateSkillLevel(skillData, playerExp) {
            for (let i = 0; i < skillData.length; i++) {
                if (skillData[i].totalExpRequired > playerExp) {
                    const prevLevelExp = skillData[i - 1]?.totalExpRequired || 0;
                    const levelExp = skillData[i].totalExpRequired - prevLevelExp;
                    const currentLevelProgress = playerExp - prevLevelExp;
                    return i + currentLevelProgress / levelExp;
                }
            }
            return skillData.length; // Max level if experience exceeds last level
        }

        try {
            // Fetch the player's UUID from Mojang API
            const { data: mojangData } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
            const uuid = mojangData.id;

            // Fetch the player's profiles from Hypixel SkyBlock API
            const { data: hypixelData } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixel_key}&uuid=${uuid}`);

            if (!hypixelData.profiles || hypixelData.profiles.length === 0) {
                return inter.editReply(`No profiles found for ${player}.`);
            }

            // Find the correct profile by profile name
            const playerProfile = hypixelData.profiles.find(p => p.cute_name.toLowerCase() === profile);
            if (!playerProfile) {
                return inter.editReply(`No profile found with the name ${profile} for ${player}.`);
            }

            const memberData = playerProfile.members[uuid].player_data?.experience;
            if (!memberData) {
                return inter.editReply(`${player} has their Skill API disabled.`);
            }

            // Fetch skill requirements from Hypixel resources API
            const { data: skillResources } = await axios.get('https://api.hypixel.net/v2/resources/skyblock/skills');

            // Calculate skill averages for each skill
            const skills = [
                { name: 'Farming', key: 'SKILL_FARMING' },
                { name: 'Mining', key: 'SKILL_MINING' },
                { name: 'Combat', key: 'SKILL_COMBAT' },
                { name: 'Foraging', key: 'SKILL_FORAGING' },
                { name: 'Fishing', key: 'SKILL_FISHING' },
                { name: 'Enchanting', key: 'SKILL_ENCHANTING' },
                { name: 'Alchemy', key: 'SKILL_ALCHEMY' },
                { name: 'Carpentry', key: 'SKILL_CARPENTRY' },
                { name: 'Taming', key: 'SKILL_TAMING' },
            ];

            let skillTotal = 0;

            for (const skill of skills) {
                const playerExp = memberData[skill.key];
                if (playerExp !== undefined) {
                    const skillLevels = skillResources.skills[skill.name.toUpperCase()].levels;
                    const skillLevel = calculateSkillLevel(skillLevels, playerExp);
                    skillTotal += skillLevel;
                    console.log(`${skill.name}: ${skillLevel}`);
                } else {
                    console.log(`${skill.name}: Not found in player data`);
                }
            }

            // Special case for Dungeons (uses a different system)
            const dungeonExpArray = [
                0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340, 35640, 50040, 70040, 97640,
                135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640, 1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640,
                13259640, 17559640, 23159640, 30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640, 285559640,
                360559640, 453559640, 569809640,
            ];

            const dungeonExp = playerProfile.members[uuid].dungeons?.dungeon_types?.catacombs?.experience || 0;
            const dungeonLevel = calculateSkillLevel(dungeonExpArray.map(totalExpRequired => ({ totalExpRequired })), dungeonExp);
            skillTotal += dungeonLevel;
            console.log(`Dungeons: ${dungeonLevel}`);

            // Calculate and send the skill average
            const skillAverage = (skillTotal / 10).toFixed(2);
            inter.editReply(`${player}: Skill average is ${skillAverage}`);
        } catch (error) {
            console.error(error);
            inter.editReply('An error occurred while fetching skill data. Please try again later.');
        }
    },
};
