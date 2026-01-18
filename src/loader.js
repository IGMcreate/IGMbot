console.log(`Starting bot process PID=${process.pid} at ${new Date().toISOString()}`);
const { readdirSync } = require('fs');
const { Collection } = require('discord.js');
const { useMainPlayer } = require('discord-player');
client.commands = new Collection();
CommandsArray = [];
const player = useMainPlayer()



const DiscordEvents = readdirSync('./events/Discord/').filter(file => file.endsWith('.js'));
const PlayerEvents = readdirSync('./events/Player/').filter(file => file.endsWith('.js'));

for (const file of DiscordEvents) {
    const DiscordEvent = require(`../events/Discord/${file}`);
    console.log(`-> [Loaded Discord Event] ${file.split('.')[0]}`);
    client.on(file.split('.')[0], DiscordEvent.bind(null, client));
    delete require.cache[require.resolve(`../events/Discord/${file}`)];
};

for (const file of PlayerEvents) {
    const PlayerEvent = require(`../events/Player/${file}`);
    console.log(`-> [Loaded Player Event] ${file.split('.')[0]}`);
    player.events.on(file.split('.')[0], PlayerEvent.bind(null));
    delete require.cache[require.resolve(`../events/Player/${file}`)];
};


// readdirSync('./commands/').forEach(dirs => {
//     const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

//     for (const file of commands) {
//         const command = require(`../commands/${dirs}/${file}`);
//         if (command.name && command.description) {
//             CommandsArray.push(command);
//             console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
//             client.commands.set(command.name.toLowerCase(), command);
//             delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
//         } else console.log(`[failed Command]  ${command.name.toLowerCase()}`)
//     };
// });

readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`../commands/${dirs}/${file}`);
        if (command.name && command.description) {
            if (client.commands.has(command.name.toLowerCase())) {
                console.log(`[skipped duplicate command] ${command.name.toLowerCase()}`);
            } else {
                CommandsArray.push(command);
                console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
                client.commands.set(command.name.toLowerCase(), command);
            }
            delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
        } else {
            console.log(`[failed Command]  ${command.name ? command.name.toLowerCase() : 'unnamed command'}`);
        }
    };
});

// client.on('ready', (client) => {
//     if (client.config.app.global) client.application.commands.set(CommandsArray)
//     else client.guilds.cache.get(client.config.app.guild).commands.set(CommandsArray)
// })
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (client.config.app.global) {
        client.application.commands.set(CommandsArray)
            .then(() => console.log('Global commands registered'))
            .catch(console.error);
    } else {
        const guild = client.guilds.cache.get(client.config.app.guild);
        if (guild) {
            guild.commands.set(CommandsArray)
                .then(() => console.log('Guild commands registered'))
                .catch(console.error);
        } else {
            console.error('Guild not found for commands registration');
        }
    }
});
