# Music-bot

Dont forget - https://www.youtube.com/iframe_api

# Configuration

The main folder `config.js`.

```js
module.exports = {
    app: {
        token: 'XXX',
        playing: 'by IGM',
        global: true,
        guild: 'xxx'
        ExtraMessages: false,
        loopMessage: false,
},
    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        maxVol: 100,
        spotifyBridge: true,
        volume: 75,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 60000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 60000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
```

Basic configuration

- `app/token`, Can be found in discord developer portal / ask me
- `app/playing`, the activity status of the bot
- `app/global`, whether the commands will work on all servers or just one (if global they might take a while to show up)
- `app/guild`, the guild the slash command will be loaded to (this only applys if global is set to false)
- `app/ExtraMessages` will increase the amount of bot spam, while you get more infomation
- `opt/loopMessage`, if the message that a music is played should be sent when it is looped

DJ mode configuration

- `opt/DJ/enabled`, whether the DJ mode should be activated or not 
- `opt/DJ/roleName`, the name of the DJ role to be used
- `opt/DJ/commands`, the list of commands limited to members with the DJ role

Advanced configuration

- `opt/maxVol`, the maximum volume that users can define
- `opt/spotifyBridge`, takes spotify songs/playlists and searches it on youtube and plays it
- `opt/volume`, is the defaul volume the queue will start at
- `opt/leaveOnEmpty`, if the bot will leave when the queue is empty
- `opt/leaveOnEmptyCooldown`, the cooldown before the bot leaves when the queue is empty
- `opt/leaveOnEnd`,  if the bot will leave on finishing the queue
- `opt/leaveOnEndCooldown`, the cooldown before the bot leaves on finishing the queue
- `opt/discordPlayer`, options used by discord-player

###  Installation
[FFmpeg](https://www.ffmpeg.org)

[Node JS](https://nodejs.org/en/) v16.9 or newer for environment

[visual studio code](https://code.visualstudio.com/) 

To run type: npm start