const { joinVoiceChannel, EndBehaviorType } = require("@discordjs/voice");
const { ApplicationCommandOptionType } = require("discord.js");
const fs = require('fs');
const path = require('path');
const { OggLogicalBitstream, OpusHead } = require("prism-media/dist/opus");
const { pipeline } = require("stream");
const whisper = require("whisper-node");

const TARGET_KEYWORDS = ["play", "skip", "pause", "stop", "hello"];

function createAudioFile(voiceReceiver, member) {
    if (voiceReceiver.subscriptions.has(member.id)) return;

    const opusStream = voiceReceiver.subscribe(member.id, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 800
        },
    });

    const pcmConverter = new FFmpeg({
        args: [
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            '-f', 'wav',
            '-ar', '16000',
            '-ac', '1'
        ],
    });

    const oggStream = new OggLogicalBitstream({
        opusHead: new OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const targetFolder = path.join(__dirname, "../../recordings", member.id);
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filename = path.join(targetFolder, `${Date.now()}.wav`);
    const out = fs.createWriteStream(filename);

    console.log(`[Recording] Writing audio chunks for ${member.user.username}...`);

    pipeline(opusStream, pcmConverter, out, async (err) => {
        if (err) {
            console.error(`[Error] Audio recording pipeline broke:`, err);
            return;
        }

        if (!fs.existsSync(filename) || fs.statSync(filename).size === 0) {
            try { fs.unlinkSync(filename); } catch (e) { }
            return;
        }

        try {
            console.log(`[Whisper AI] Processing speech locally...`);

            const response = await whisper(filename);

            let transcript = "";
            if (Array.isArray(response)) {
                transcript = response.map(segment => segment.speech || segment.text || "").join(" ");
            }

            transcript = transcript.trim().toLowerCase();
            console.log(`[Whisper AI] Transcription result: "${transcript}"`);
            if (transcript.length > 0) {
                console.log(`[Transcript] ${member.user.username} said: "${transcript}"`);

                for (const word of TARGET_KEYWORDS) {
                    if (transcript.includes(word)) {
                        console.log(`[KEYWORD MATCH] Triggered action phrase: "${word}"`);

                        if (word === "skip") {
                            console.log("Executing music player track skip command...");
                            
                        }
                    }
                }
            }
        } catch (whisperError) {
            console.error("[Whisper Error] Execution failed:", whisperError);
        } finally {
            try {
                if (fs.existsSync(filename)) fs.unlinkSync(filename);
            } catch (cleanupErr) { }

            opusStream.destroy();
            pcmConverter.destroy();
            out.destroy();
        }
    });
}


module.exports = {
    name: 'listener',
    description: "listens to you",
    voiceChannel: true,

    async execute({ inter }) {
        if (inter.member.voice.channel != null) {
            let call = inter.member.voice.channel.name;
            let callID = inter.member.voice.channel.id;
            let guild = inter.member.voice.channel.guild;

            if (call) {
                let m = "Joining " + inter.member.user.username + " @ " + call;
                await inter.editReply({ content: m, ephemeral: true });

                const channel = inter.member.voice.channel;

                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });

                const voiceReceiver = connection.receiver;
                voiceReceiver.speaking.removeAllListeners('start');

                voiceReceiver.speaking.on('start', (userId) => {
                    if (userId === inter.client.user.id) return;

                    const member = channel.members.get(userId);
                    if (member) {
                        createAudioFile(voiceReceiver, member);
                    }
                });
            }
        }
        else {
            let m = "Cannot Join " + inter.member.user.username + ".";
            await inter.editReply({ content: m, ephemeral: true });
        }
    },
};