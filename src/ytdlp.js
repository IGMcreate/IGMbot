const { execFile } = require('child_process');

const YTDLP = 'yt-dlp';

// single track
function getStreamURL(query) {
    return new Promise((resolve, reject) => {
        execFile(
            YTDLP,
            ['-f', 'ba', '-g', query],
            (err, stdout) => {
                if (err) return reject(err);
                resolve(stdout.trim());
            }
        );
    });
}

// playlist extractor
function getPlaylist(query) {
    return new Promise((resolve, reject) => {
        execFile(
            YTDLP,
            [
                '--no-abort-on-error',
                '--print',
                'url',
                query
            ],
            (err, stdout) => {
                if (err) return reject(err);

                const urls = stdout
                    .split('\n')
                    .map(v => v.trim())
                    .filter(Boolean);

                resolve(urls);
            }
        );
    });
}

module.exports = {
    getStreamURL,
    getPlaylist
};