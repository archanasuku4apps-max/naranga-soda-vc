const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Naranga Soda VC Bot Online");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server running");
});
const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TEMP_CATEGORY = "1478037225911619594";

const CREATE_CHANNELS = {
  "1478037812711260190": { name: "Solo VC", limit: 1 },
  "1478037955812786388": { name: "Duo VC", limit: 2 },
  "1478038027640111195": { name: "Trio VC", limit: 3 },
  "1478038114688696440": { name: "Squad VC", limit: 4 }
};

client.once("clientReady", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
console.log("Voice event:", newState.channelId);
  try {
    const config = CREATE_CHANNELS[newState.channelId];

    // Create temp VC
    if (config) {
      const tempChannel = await newState.guild.channels.create({
        name: `${newState.member.user.username}'s ${config.name}`,
        type: ChannelType.GuildVoice,
        parent: TEMP_CATEGORY,
        userLimit: config.limit
      });

      await newState.member.voice.setChannel(tempChannel);
    }

    // Delete empty temp VC
    if (
      oldState.channel &&
      oldState.channel.members.size === 0 &&
      !CREATE_CHANNELS[oldState.channel.id] &&
      oldState.channel.parentId === TEMP_CATEGORY
    ) {
      await oldState.channel.delete().catch(console.error);
    }

  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.DISCORD_TOKEN)
