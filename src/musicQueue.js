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
                '--print', 'url',
                '--no-abort-on-error',
                url
            ], (err, stdout) => {
                if (err) return reject(err);
                const urls = stdout.split('\n').map(v => v.trim()).filter(v => v && v !== 'NA');
                if (urls.length === 0) return resolve([url]);
                resolve(urls);
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

    async add(url) {
        console.log('[QUEUE] add():', url);
        try {
            const urls = await this.getPlaylistUrls(url);
            console.log(`[QUEUE] Added ${urls.length} track(s)`);
            
            this.queue.push(...urls);

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

        if (this.queue.length === 0) {
            this.playing = false;
            this.current = null;
            return;
        }

        const url = this.queue.shift();
        this.current = url;
        this.playing = true;

        console.log('[NEXT] Playing:', url);

        const stream = await this.createStream(url);

        const resource = createAudioResource(stream, {
            inputType: StreamType.OggOpus
        });

        if (!this.subscribed) {
            console.log('[VOICE] subscribing player');
            this.connection.subscribe(this.player);
            this.subscribed = true;
        }

        this.player.play(resource);

        console.log('[NEXT] audio started');
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

    isPlaying() {
        return this.playing;
    }
}

module.exports = MusicQueue;