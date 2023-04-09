if (!process.env.YOUTUBE_API_TOKEN) return;

const { YouTube } = require('popyt');
const yt = new YouTube(process.env.YOUTUBE_API_TOKEN);

queue = [];

queue.addSong = (identity, link) => new Promise(async (resolve, reject) => {
    let match = link.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/mi);
    if (!match || !match[1]) return reject("Invalid URL.");

    const videoInfo = await yt.getVideo(match[1]);
    if (!videoInfo) return reject("Video not found.");
    if (videoInfo.minutes >= 10) return reject("Video must be under 10 minutes long.");

    queue.push({
        id: match[1],
        requestedBy: identity.name,
        title: videoInfo.title,
        uploader: videoInfo.channel.name,
        duration: (videoInfo.minutes * 60) + videoInfo.seconds,
        thumbnail: videoInfo.thumbnails.default.url
    });
    resolve();
});

queue.nextSong = async () => {
    if (queue.length < 1) { return null; }
    return queue.shift();
}

console.log("YouTube queue initialized.");

module.exports = queue;