const loadConfig = async () => {
    await fetch("/config").then((res) => {
        res.json().then((config) => {
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
        });
    });
}

window.addEventListener("load", async () => {
    await loadConfig();
});