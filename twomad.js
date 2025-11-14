const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');
const app = express();


const TOKEN = process.env.BOT_TOKEN;      // from Render env
const GUILD_ID = '1210305827148144701';
const VOICE_CHANNEL_ID = '1417545211109834885';

const client = new Client({
  checkUpdate: false,
  readyStatus: false
});

client.on('ready', async () => {
  console.log(`[READY] Logged in as ${client.user.username}#${client.user.discriminator}`);

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

  try {
    await channel.join();
    console.log('Joined VC and staying there.');
  } catch (error) {
    console.error('Error joining voice channel:', error);
  }
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot is running.');
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

client.login(TOKEN);
