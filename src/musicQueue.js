const {
    createAudioPlayer,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    createAudioResource,
    StreamType,
    entersState,
    VoiceConnectionStatus
} = require('@discordjs/voice');

const { spawn, execFile } = require('child_process');
const path = require('path');
const YTDLP = path.join(__dirname, '../yt-dlp.exe');

class MusicQueue {
    constructor(connection) {
        console.log('[QUEUE] Creating MusicQueue');

        this.connection = connection;

        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        this.queue = [];
        this.current = null;
        this.playing = false;
        this.subscribed = false;

        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log('[PLAYER] Idle → next()');
            this.next();
        });

        this.player.on('error', (err) => {
            console.error('[PLAYER ERROR]', err);
        });

        this.connection.on('stateChange', (oldState, newState) => {
            console.log('[VOICE STATE]', oldState.status, '→', newState.status);
        });
    }

    async getPlaylistUrls(url) {
        return new Promise((resolve, reject) => {
            execFile(YTDLP, [
                '--flat-playlist',
                '--print', '%(title)s|||%(url)s',
                '--no-abort-on-error',
                url
            ], (err, stdout) => {
                if (err) return reject(err);
                //console.log(stdout);
                const results = stdout.split('\n').map(v => v.trim()).filter(v => v && v !== 'NA|||NA');
                const objects = results.map(line => {
                    const [title, url] = line.split('|||');
                    return { title, url };
                });
                if (objects.length === 1) return resolve([{ title: objects[0].title, url: url }]);
                resolve(objects);
            });
        });
    }

    async createStream(url) {
        console.log('[STREAM] starting:', url);

        const yt = spawn(YTDLP, [
            '-f',
            'bestaudio',
            '-o',
            '-',
            url
        ]);

        const ffmpeg = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-f', 'opus',
            '-ar', '48000',
            '-ac', '2',
            'pipe:1'
        ]);

        yt.stdout.pipe(ffmpeg.stdin);

        //yt.stderr.on('data', d => console.log('[yt-dlp]', d.toString()));
        yt.stderr.on('error', d => console.log('[yt-dlp]', d.toString()));
        //ffmpeg.stderr.on('data', d => console.log('[ffmpeg]', d.toString()));
        ffmpeg.stderr.on('error', d => console.log('[ffmpeg]', d.toString()));

        const stream = ffmpeg.stdout;

        stream.on('close', () => {
            console.log('[STREAM] closed:', url);
            yt.kill();
            ffmpeg.kill();
        });

        return stream;
    }

    async add(url, type) {
        let guild = client.guilds.cache.get(this.connection.joinConfig.guildId);
        let channel = guild.channels.cache.find(channel => channel.name === 'music');

        console.log('[QUEUE] add():', url);
        try {
            const urls = await this.getPlaylistUrls(url);
            console.log(`[QUEUE] Added ${urls.length} track(s)`);
            channel.send(`Added ${urls.length} track(s) to the queue!`).catch(console.error);
            if (type === 'end') {
                this.queue.push(...urls);
            } else if (type === 'start') {
                this.queue.unshift(...urls);
            }

            if (!this.playing) {
                this.next();
            }
        } catch (err) {
            console.error('[ADD ERROR] Failed to fetch URLs:', err);
        }

        // this.queue.push(url);

        // console.log('[QUEUE] length:', this.queue.length);

        // if (!this.playing) {
        //     this.next();
        // }
    }

    async next() {
        console.log('[NEXT] Called');

        let guild = client.guilds.cache.get(this.connection.joinConfig.guildId);
        let channel = guild.channels.cache.find(channel => channel.name === 'music');

        if (this.queue.length === 0) {
            this.playing = false;
            this.current = null;
            return;
        }

        const track = this.queue.shift();
        this.current = track;
        this.playing = true;

        console.log('[NEXT] Playing:', track.title);

        channel.send('Now playing: ' + track.title)
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);

        try {
            // Use track.url for the actual downloader
            const stream = await this.createStream(track.url);
            const resource = createAudioResource(stream, { inputType: StreamType.OggOpus });

            if (!this.subscribed) {
                this.connection.subscribe(this.player);
                this.subscribed = true;
            }

            this.player.play(resource);
        } catch (err) {
            console.error('[NEXT ERROR] Skipping:', track.title, err);
            this.next();
        }
    }

    skip() {
        console.log('[QUEUE] skip');
        this.next();
    }

    stop() {
        console.log('[QUEUE] stop');
        this.queue = [];
        this.player.stop();
        this.playing = false;
        this.current = null;
    }

    shuffle() {
        for (var i = this.queue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.queue[i];
            this.queue[i] = this.queue[j];
            this.queue[j] = temp;
        }
    }
}

module.exports = MusicQueue;