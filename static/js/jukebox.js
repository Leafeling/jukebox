let currentSong = {
    id: "",
    timeStarted: 0
};

const getProviderUrl = async (provider) => {
    switch (provider.toLowerCase()) {
        case "youtube": return "https://www.youtube.com/embed/$songId";
        default: return "";
    }
}

let cfg = {};
const loadConfig = async () => {
    let response = await fetch("/config");
    let config = await response.json();
    cfg = config;
    document.title = config.name;
            
    if (!!config.icon) {
        let iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        iconLink.href = config.icon;
        document.head.appendChild(iconLink);
    }

    if (!!config.logo) {
        document.querySelectorAll(".__config-logo").forEach((logo) => logo.setAttribute("src", config.logo));
    }
            
    if (!!config.theme) {
        document.body.style.setProperty("--theme-background", config.theme["background"]);
        document.body.style.setProperty("--theme-navbar", config.theme["navbar"]);
        document.body.style.setProperty("--theme-text-light", config.theme["text-light"]);
        document.body.style.setProperty("--theme-text", config.theme["text"]);
    }
}

const connectSocket = async () => {
    const socket = io();

    socket.on("current", async (song) => {
        await changeSong(song);
    });
}

const changeSong = async (song) => {
    currentSong = song;

    if (!currentSong) document.querySelector("#player").classList.add("hidden");
    else {
        if (!!ytPlayer) ytPlayer.loadVideoById(song.id, (Date.now() - song.timeStarted) / 1000);
        document.querySelector("#player").classList.remove("hidden");
    }
}

const loadPlayer = async (provider) => {
    switch (provider) {
        case "youtube":
            // Initialize YouTube Iframe API.
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            break;
        default: return;
    }
}

const startPlayer = async () => {
    if (!!ytPlayer) ytPlayer.playVideo();
}

let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('player', {
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': (e) => {
                e.target.playVideo();
                e.target.setVolume(100);

                ytPlayer = e.target;
                changeSong(currentSong);
            }
        }
    })
}

window.addEventListener("load", async () => {
    await loadConfig();
    await loadPlayer(cfg.provider);
    await connectSocket();
});