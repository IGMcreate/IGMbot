// const axios = require('axios');

// // Function to get Mojang data
// async function getMojangData(player) {
//     try {
//         const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
//         return data; // This will contain the Mojang data, including the UUID
//     } catch (error) {
//         console.error('Error fetching Mojang data:', error);
//         throw error;
//     }
// }

// // Function to get Hypixel data
// async function getHypixelData(uuid, hypixelKey) {
//     try {
//         const { data } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixelKey}&uuid=${uuid}`);
//         return data; // This will contain the Hypixel data, including player profiles
//     } catch (error) {
//         console.error('Error fetching Hypixel data:', error);
//         throw error;
//     }
// }

// module.exports = { getMojangData, getHypixelData };
import axios from 'axios';

// Function to get Mojang data
export async function getMojangData(player) {
    try {
        const { data } = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${player}`);
        return data; // This will contain the Mojang data, including the UUID
    } catch (error) {
        console.error('Error fetching Mojang data:', error);
        throw error;
    }
}

// Function to get Hypixel data
export async function getHypixelData(uuid, hypixelKey) {
    try {
        const { data } = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?key=${hypixelKey}&uuid=${uuid}`);
        return data; // This will contain the Hypixel data, including player profiles
    } catch (error) {
        console.error('Error fetching Hypixel data:', error);
        throw error;
    }
}