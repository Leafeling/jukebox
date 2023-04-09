# Jukebox
Jukebox provides a self-hosted, configurable music queue.

## Running
Running your own Jukebox instance requires:
- Git
- NodeJS 16.x or later
- (optional) [PNPM package manager](https://pnpm.io/)

To start, clone the repository using:
```git clone https://github.com/leafeling```

Then create your own [`config.json`](./config.example.json) and [`.env`](./.env.example) files, based off their respective examples. These are needed to configure your instance's port, settings, theme and tokens used for queue providers.

Add files matching the `icon` and `logo` files to the `/assets` folder with the file paths you configured in your `config.json`.

After you're done configuring, launch your instance with:
`npm run start` or `pnpm start`

Jukebox binds to `0.0.0.0:3000` by default.