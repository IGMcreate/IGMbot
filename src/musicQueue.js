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
const { EmbedBuilder } = require('discord.js');
//const { pipeline } = require('node:stream');
const YTDLP = 'yt-dlp';
const vol = client.config.opt.volume;

class MusicQueue {
    constructor(connection) {
        console.log('[QUEUE] Creating MusicQueue');

        this.connection = connection;
        this.textChannel = null;

        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        this.queue = [];
        this.history = [];
        this.current = null;
        this.playing = false;
        this.subscribed = false;
        this.subscription = null;
        this.idleTimeout = null;
        this.resource = null;
        this.volume = vol;
        this.inter = null;
        this.paused = false;
        this.repeatMode = 'typeOff';

        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log('[PLAYER] Idle → next()');
            if (this.queue.length > 0) {
                this.next();
            } else {
                this.playing = false;
                this.current = null;
                this.scheduleIdleStop();
            }
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
                '-j',
                '--no-abort-on-error',
                url
            ], (err, stdout) => {
                if (err) return reject(err);
                //console.log(stdout);
                const resultsJSON = stdout.split('\n').map(v => v.trim()).filter(v => v && v !== 'NA' && v.startsWith('{')).map(v => {
                    const data = JSON.parse(v)
                    //console.log(data)
                    const videoUrl = data.url || `https://youtube.com/watch?v=${data.id}`
                    return {
                        title: data.title || 'Unknown Track',
                        url: videoUrl,
                        thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${data.id}/hqdefault.jpg`,
                        duration: data.duration || 0, // In seconds
                        author: (data.channel || data.uploader)?.trim() || undefined,
                    };
                });
                resolve(resultsJSON);
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

        // const ffmpeg = spawn('ffmpeg', [
        //     '-i', 'pipe:0',
        //     '-f', 'opus',
        //     '-ar', '48000',
        //     '-ac', '2',
        //     'pipe:1'
        // ]);

        // pipeline(
        //     yt.stdout,
        //     ffmpeg.stdin,
        //     (err) => {
        //         if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        //             console.error('[PIPELINE ERROR]', err.message);
        //         }
        //     }
        // );

        //yt.stdout.pipe(ffmpeg.stdin);

        // yt.stderr.on('data', d => console.log('[yt-dlp]', d.toString()));
        yt.stderr.on('error', d => console.log('[yt-dlp]', d.toString()));
        // ffmpeg.stderr.on('data', d => console.log('[ffmpeg]', d.toString()));
        //ffmpeg.stderr.on('error', d => console.log('[ffmpeg]', d.toString()));

        const stream = yt.stdout;

        stream.on('close', () => {
            console.log('[STREAM] closed:', url);
            yt.kill();
            //ffmpeg.kill();
        });

        return stream;
    }

    async add(url, type, inter) {
        this.inter = inter
        console.log('[QUEUE] add():', url);
        try {
            const urls = await this.getPlaylistUrls(url);
            console.log(`[QUEUE] Added ${urls.length} track(s)`);
            if (type === 'end') {
                this.queue.push(...urls);
            } else if (type === 'start') {
                this.queue.unshift(...urls);
            }

            urls.forEach(element => {
                element.user = inter.user.id
            });

            this.clearIdleStop();
            if (!this.playing) {
                this.next();
            }

            return urls

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
            this.player.stop();
            return;
        }

        switch (this.repeatMode) {
            case 'typeOff':
                break;
            case 'typeTrack':
                if (this.current) {
                    this.queue.unshift(this.current);
                    this.history.pop();
                }
                break;
            case 'typeQueue':
                if (this.current) {
                    this.queue.push(this.current);
                }
                break;
        }
        const track = this.queue.shift();
        this.history.push(track);
        this.current = track;
        this.playing = true;

        console.log('[NEXT] Playing:', track.title);

        const user = await client.users.fetch(track.user)
        const newSong = {
            color: 0x2f3136,
            title: track.title,
            url: track.url,
            thumbnail: {
                url: track.thumbnail
            },
            author: {
                name: 'Now playing: '// + track.title
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Requested by ' + user.globalName,
                icon_url: user.displayAvatarURL(), //add 'requested by' (make it inter.user.id) to the queue object then inter.user.displayAvatarURL()
            },
        }
        this.textChannel.send({ embeds: [newSong] })

        try {
            // Use track.url for the actual downloader
            const stream = await this.createStream(track.url);
            this.resource = createAudioResource(stream, { inlineVolume: true });
            this.resource.volume.setVolumeLogarithmic(this.volume / 100);

            if (!this.subscribed) {
                this.subscription = this.connection.subscribe(this.player);
                this.subscribed = true;
            }

            this.player.play(this.resource);
        } catch (err) {
            console.error('[NEXT ERROR] Skipping:', track.title, err);
            this.next();
        }
    }

    back() {
        console.log('[BACK] Called');
        if (this.history.length > 0) {
            for (let i = 0; i < 2; i++) {
                const track = this.history.pop();
                this.queue.unshift(track);
            }
            this.next();
        }
    }

    skip() {
        console.log('[QUEUE] skip');
        this.next();
    }

    stop() {
        console.log('[QUEUE] stop');
        this.clearIdleStop();
        this.queue = [];
        this.playing = false;
        this.current = null;

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }

        this.subscribed = false;
        this.player.stop();
        this.connection.destroy();
    }

    removeTrack(track) {
        const index = this.queue.indexOf(track);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    jump(track) {
        const index = this.queue.indexOf(track);
        if (index !== -1) {
            this.queue.splice(index, 1);
            this.queue.unshift(track);
            this.next();
        }
    }

    skipTo(track) {
        const index = this.queue.indexOf(track);
        if (index !== -1) {
            this.queue.splice(0, index);
            this.next();
        }
    }

    pauseState(type) {
        return new Promise((resolve, reject) => {
            if (type === 'pause') {
                console.log('[QUEUE] pause');
                //this.player.pause();
                this.paused = true;
                resolve(this.player.pause());
            } else if (type === 'resume') {
                console.log('[QUEUE] resume');
                //this.player.resume();
                this.paused = false;
                resolve(this.player.unpause());
            } else {
                reject('invalid type');
            }
        }
        );
    }


    shuffle() {
        for (var i = this.queue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.queue[i];
            this.queue[i] = this.queue[j];
            this.queue[j] = temp;
        }
    }

    setVolume(volume) {
        try {
            this.volume = volume;
            this.resource.volume.setVolumeLogarithmic(volume / 100);
            return true
        } catch (e) {
            console.log('[volume error]' + e)
            return false
        }
    }

    scheduleIdleStop() {
        this.clearIdleStop();
        this.idleTimeout = setTimeout(() => {
            if (this.player.state.status === AudioPlayerStatus.Idle && this.queue.length === 0) {
                console.log('[QUEUE] Idle timeout reached, stopping queue');
                try {
                    this.stop();
                } catch (e) {
                    console.error('[QUEUE] Error stopping queue:', e);
                }
            }
        }, 30_000);
    }

    clearIdleStop() {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
    }

    createProgressBar() {
        const duration = (Math.floor(this.current.duration / 60)).toString() + ":" + (this.current.duration % 60).toString().padStart(2, "0")
        const playbackDuration = (Math.floor(this.player.state.resource?.playbackDuration / 60000)).toString() + ":" + (Math.floor(this.player.state.resource?.playbackDuration / 1000) % 60).toString().padStart(2, "0")

        return playbackDuration + " **|** " + "▬".repeat((14 * ((this.player.state.resource?.playbackDuration / 1000) / this.current.duration)).toFixed(0)) + ":radio_button:" + "▬".repeat(14 - (14 * ((this.player.state.resource?.playbackDuration / 1000) / this.current.duration)).toFixed(0)) + " **|** " + duration
    }
}

module.exports = MusicQueue;