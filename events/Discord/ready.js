export default async () => {
    console.log(`Logged to the client ${global.client.user.username}\nlets play some music!`);
    global.client.user.setActivity(global.client.config.app.playing);
};
