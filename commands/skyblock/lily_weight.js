const { default: axios } = require('axios');
const { ApplicationCommandOptionType } = require('discord.js');
const LilyWeight = require('lilyweight');

module.exports = {
    name: 'lilyweight',
    description: "Returns player's Lily Weight for the selected profile",
    options: [
        {
            name: 'player',
            description: "Player whose Lily Weight is to be displayed",
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

            const memberData = playerProfile.members[uuid];
            if (!memberData) {
                return inter.editReply(`${player} has their Skill API disabled.`);
            }

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
                { name: 'Taming', key: 'SKILL_TAMING' },
            ];

            // Calculate skill levels from experience
            const skillLevelsArray = [];
            for (const skill of skills) {
                const playerExp = memberData.player_data?.experience[skill.key];
                if (playerExp !== undefined) {
                    const skillLevels = skillResources.skills[skill.name.toUpperCase()].levels;
                    const skillLevel = calculateSkillLevel(skillLevels, playerExp);
                    skillLevelsArray.push(parseFloat(Math.floor(skillLevel)));
                } else {
                    skillLevelsArray.push(0); // If not found, assume level 0
                }
            }
    
            const skillXp = [
                memberData.player_data?.experience.SKILL_FARMING || 0, 
                memberData.player_data?.experience.SKILL_MINING || 0,  
                memberData.player_data?.experience.SKILL_COMBAT || 0,  
                memberData.player_data?.experience.SKILL_FORAGING || 0,  
                memberData.player_data?.experience.SKILL_FISHING || 0,  
                memberData.player_data?.experience.SKILL_ENCHANTING || 0,  
                memberData.player_data?.experience.SKILL_ALCHEMY || 0, 
                memberData.player_data?.experience.SKILL_TAMING || 0, 
            ];

            // Define catacombs experience and slayer experience
            const catacombsExperience = memberData.dungeons?.dungeon_types?.catacombs?.experience || 0;
            const slayerExperience = [(memberData.slayer.slayer_bosses?.zombie?.xp || 0), (memberData.slayer.slayer_bosses?.spider.xp || 0), (memberData.slayer.slayer_bosses?.wolf.xp || 0), (memberData.slayer.slayer_bosses?.enderman.xp || 0), (memberData.slayer.slayer_bosses?.vampire.xp || 0), (memberData.slayer.slayer_bosses?.blaze.xp || 0)];
            const cata_completions = { "0": (memberData.dungeons.dungeon_types.catacombs.tier_completions[0] || 0), "1": (memberData.dungeons.dungeon_types.catacombs.tier_completions[1] || 0), "2": (memberData.dungeons.dungeon_types.catacombs.tier_completions[2] || 0), "3": (memberData.dungeons.dungeon_types.catacombs.tier_completions[3] || 0), "4": (memberData.dungeons.dungeon_types.catacombs.tier_completions[4] || 0), "5": (memberData.dungeons.dungeon_types.catacombs.tier_completions[5] || 0), "6": (memberData.dungeons.dungeon_types.catacombs.tier_completions[6] || 0), "7": (memberData.dungeons.dungeon_types.catacombs.tier_completions[7] || 0) } 
            const cata_master_completions = { "1": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[0] || 0), "2": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[2] || 0), "3": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[3] || 0), "4": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[4] || 0), "5": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[5] || 0), "6": (memberData.dungeons.dungeon_types?.master_catacombs?.tier_completions[6] || 0) } 
            // Calculate Lily Weight using LilyWeight.getWeightRaw
            const lilyWeight = LilyWeight.getWeightRaw(
                skillLevelsArray.map(level => parseFloat(level)), 
                skillXp.map(exp => parseFloat(exp)),
                cata_completions,
                cata_master_completions,
                catacombsExperience, 
                slayerExperience 
            );
            console.log(`${player}'s Lily Weight for profile ${profile} is **${lilyWeight.total}**`)
            console.log(lilyWeight)
            inter.editReply(`${player}'s Lily Weight for profile ${profile} is **${(lilyWeight.total).toFixed(2)}**`);
        } catch (error) {
            console.error(error);
            inter.editReply('An error occurred while fetching Lily Weight data. Please try again later.');
        }
    },
};
