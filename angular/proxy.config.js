const PROXY_CONFIG = {
  "/api/*": {
    target: "http://localhost:6200",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
};

module.exports = PROXY_CONFIG;
