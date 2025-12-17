module.exports = {
    app: {
        token: 'Put Token Here',
        access_token: 'Get token from youtubei extractor',
        hypixel_api_token: '367cef45-514b-4bf5-a743-e40e03413fbb',
        playing: 'start the musicbox - steyn',
        global: true,
        guild: '835207139357360129',
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
        leaveOnEmpty: false,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 3000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
