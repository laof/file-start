const path = require("path");
const homPage = "/ui.html";
const sharedPath = path.join(process.cwd());
const IP = require("./tools/address");
const port = require("./tools/port");

module.exports = {
  homPage: homPage,
  hostUrl: `http://${IP}:${port}${homPage}`,
  port,
  IP,
  sharedPath,
};
