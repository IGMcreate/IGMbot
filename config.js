module.exports = {
    app: {
        token: process.env.DISCORD_TOKEN,
        //token: process.env.DISCORD_TOKEN_TEST, //test bot
        access_token: '',
        hypixel_api_token: '', //temp token
        playing: 'start the musicbox - steyn',
        global: true,
        guild: '835207139357360129',
        ExtraMessages: true,
        loopMessage: false,

    },

    opt: {
        maxVol: 200,
        spotifyBridge: true,
        volume: 75,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 0,
        leaveOnEnd: false,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};