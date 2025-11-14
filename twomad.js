const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');
const app = express();


const TOKEN = process.env.BOT_TOKEN;      // from Render env
const GUILD_ID = '1210305827148144701';
const VOICE_CHANNEL_ID = '1417545211109834885';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Guild not found');
    return;
  }

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel || channel.type !== 2) { // 2 = GUILD_VOICE in older discord.js; use ChannelType.GuildVoice in v14+
    console.error('Voice channel not found or not voice');
    return;
  }


  const PORT = process.env.PORT || 3000;

// Basic route (useful for uptime checks on Render)
app.get('/', (req, res) => {
  res.send('Bot is running.');
});

// Start web server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

  joinVoiceChannel({
    channelId: VOICE_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfMute: false,
    selfDeaf: false
  });

  console.log('Joined VC and staying there.');
});

client.login(TOKEN);
