module.exports = {
    apps: [
        {
            name: "api",
            script: "node",
            args: "api/dist/main.js",
            env: {
                PORT: 3000,
            },
        },
        {
            name: "python",
            script: "python",
            args: "python/server.py",
            env: {
                PORT: 6060,
            },
        },
        {
            name: "web",
            script: "npm",
            args: "start --prefix web",
            env: {
                PORT: 7000,
            },
        },
    ],
};
