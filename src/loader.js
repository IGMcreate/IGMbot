// console.log(`Starting bot process PID=${process.pid} at ${new Date().toISOString()}`);
// const { readdirSync } = require('fs');
// const { Collection } = require('discord.js');
// const { useMainPlayer } = require('discord-player');
// client.commands = new Collection();
// CommandsArray = [];
// const player = useMainPlayer()



// const DiscordEvents = readdirSync('./events/Discord/').filter(file => file.endsWith('.js'));
// const PlayerEvents = readdirSync('./events/Player/').filter(file => file.endsWith('.js'));

// for (const file of DiscordEvents) {
//     const DiscordEvent = require(`../events/Discord/${file}`);
//     console.log(`-> [Loaded Discord Event] ${file.split('.')[0]}`);
//     client.on(file.split('.')[0], DiscordEvent.bind(null, client));
//     delete require.cache[require.resolve(`../events/Discord/${file}`)];
// };

// for (const file of PlayerEvents) {
//     const PlayerEvent = require(`../events/Player/${file}`);
//     console.log(`-> [Loaded Player Event] ${file.split('.')[0]}`);
//     player.events.on(file.split('.')[0], PlayerEvent.bind(null));
//     delete require.cache[require.resolve(`../events/Player/${file}`)];
// };


// // readdirSync('./commands/').forEach(dirs => {
// //     const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

// //     for (const file of commands) {
// //         const command = require(`../commands/${dirs}/${file}`);
// //         if (command.name && command.description) {
// //             CommandsArray.push(command);
// //             console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
// //             client.commands.set(command.name.toLowerCase(), command);
// //             delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
// //         } else console.log(`[failed Command]  ${command.name.toLowerCase()}`)
// //     };
// // });

// readdirSync('./commands/').forEach(dirs => {
//     const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

//     for (const file of commands) {
//         const command = require(`../commands/${dirs}/${file}`);
//         if (command.name && command.description) {
//             if (client.commands.has(command.name.toLowerCase())) {
//                 console.log(`[skipped duplicate command] ${command.name.toLowerCase()}`);
//             } else {
//                 CommandsArray.push(command);
//                 console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
//                 client.commands.set(command.name.toLowerCase(), command);
//             }
//             delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
//         } else {
//             console.log(`[failed Command]  ${command.name ? command.name.toLowerCase() : 'unnamed command'}`);
//         }
//     };
// });

// // client.on('ready', (client) => {
// //     if (client.config.app.global) client.application.commands.set(CommandsArray)
// //     else client.guilds.cache.get(client.config.app.guild).commands.set(CommandsArray)
// // })
// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//     if (client.config.app.global) {
//         client.application.commands.set(CommandsArray)
//             .then(() => console.log('Global commands registered'))
//             .catch(console.error);
//     } else {
//         const guild = client.guilds.cache.get(client.config.app.guild);
//         if (guild) {
//             guild.commands.set(CommandsArray)
//                 .then(() => console.log('Guild commands registered'))
//                 .catch(console.error);
//         } else {
//             console.error('Guild not found for commands registration');
//         }
//     }
// });
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { useMainPlayer } from 'discord-player';

if (!global.client) throw new Error("global.client is not defined. Make sure you initialize it before this loader.");

global.client.commands = new Collection();
global.CommandsArray = [];

const player = useMainPlayer();

//load discord events
const DiscordEvents = readdirSync('./events/Discord/').filter(file => file.endsWith('.js'));
for (const file of DiscordEvents) {
    const { default: DiscordEvent } = await import(`../events/Discord/${file}`);
    console.log(`-> [Loaded Discord Event] ${file.split('.')[0]}`);
    global.client.on(file.split('.')[0], DiscordEvent.bind(null, global.client));
}

//load player events
const PlayerEvents = readdirSync('./events/Player/').filter(file => file.endsWith('.js'));
for (const file of PlayerEvents) {
    const { default: PlayerEvent } = await import(`../events/Player/${file}`);
    console.log(`-> [Loaded Player Event] ${file.split('.')[0]}`);
    player.events.on(file.split('.')[0], PlayerEvent.bind(null));
}

//load commands
for (const dirs of readdirSync('./commands/')) {
    const commands = readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'));
    for (const file of commands) {
        try {
            const module = await import(`../commands/${dirs}/${file}`);
            const command = module.default || module;
            if (command.name && command.description) {
                if (!global.client.commands.has(command.name.toLowerCase())) {
                    global.client.commands.set(command.name.toLowerCase(), command);
                    global.CommandsArray.push(command);
                    console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
                } else {
                    console.log(`[skipped duplicate command] ${command.name.toLowerCase()}`);
                }
            } else {
                console.log(`[failed Command] ${command.name ? command.name.toLowerCase() : 'unnamed command'}`);
            }
        } catch (err) {
            console.error(`[failed to load command] ${file}:`, err);
        }
    }
}

//ready
global.client.on('ready', async () => {
    console.log(`Logged in as ${global.client.user.tag}!`);

    try {
        if (global.client.config.app.global) {
            await global.client.application.commands.set(global.CommandsArray);
            console.log('Global commands registered');
        } else {
            const guild = global.client.guilds.cache.get(global.client.config.app.guild);
            if (guild) {
                await guild.commands.set(global.CommandsArray);
                console.log('Guild commands registered');
            } else {
                console.error('Guild not found for commands registration');
            }
        }
    } catch (err) {
        console.error('Error registering commands:', err);
    }
});
