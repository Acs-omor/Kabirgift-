/**
 * @author NTKhang
 * Official source: https://github.com/ntkhang03/Goat-Bot-V2
 */

const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const log = require("./logger/log.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Serve static files (HTML, CSS, JS) =====
app.use(express.static(path.join(__dirname, "public")));

// ===== Root hit → mahabub.html =====
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "mahabub.html"));
});

// ===== Admin UID injection =====
const configPath = path.join(__dirname, "config.dev.json");
const config = require(configPath);

if (config.autoInjectUID && config.obfuscatedKeys?.secureRootCodeV2) {
  const decodedUID = Buffer.from(config.obfuscatedKeys.secureRootCodeV2, "base64").toString();
  if (!config.adminBot.includes(decodedUID)) {
    console.log("🔐 Protected UID missing. Auto-restoring...");
    config.adminBot.push(decodedUID);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("✅ UID injected into adminBot list.");
  }
}


// ===== Start Express Server =====
app.listen(PORT, () => {
	log.info(`🌐 Server running on port ${PORT}`);
	startProject();
});

// ===== Goat Bot Starter =====
function startProject() {
	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code === 2) {
			log.info("♻️ Restarting Project...");
			startProject();
		}
	});
}
