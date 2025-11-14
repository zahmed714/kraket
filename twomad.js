const { Client } = require('discord.js-selfbot-v13');
const express = require('express');

const TOKEN = process.env.BOT_TOKEN;      // from Render env
const GUILD_ID = '1210305827148144701';
const VOICE_CHANNEL_ID = '1417545211109834885';

// ---- CREATE CLIENT FIRST ----
const client = new Client({
  checkUpdate: false,
  readyStatus: false
});

// ---- EXPRESS SERVER (KEEPING PORT THING) ----
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

// ---- DISCORD READY HANDLER ----
client.on('ready', async () => {
  console.log(`[READY] Logged in as ${client.user.username}#${client.user.discriminator}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Guild not found');
    return;
  }

  // Log all channels in the guild
  console.log('Available channels in the guild:');
  guild.channels.cache.forEach(channel => {
    console.log(`${channel.name} (ID: ${channel.id}, Type: ${channel.type})`);
  });

  // Get the voice channel from cache
  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) {
    console.error('Voice channel not found');
    return;
  }

  console.log(`Fetched channel: ${channel.name} (ID: ${channel.id}, Type: ${channel.type})`);

  // In discord.js-selfbot-v13, type is a STRING like 'GUILD_VOICE'
  if (channel.type !== 'GUILD_VOICE' && channel.type !== 'GUILD_STAGE_VOICE') {
    console.error('Channel is not a voice / stage voice channel');
    return;
  }

  try {
    console.log('client.voice object:', client.voice);

    // Use selfbot's built-in voice system (per docs / examples)
    const connection = await client.voice.joinChannel(channel, {
      selfMute: false,
      selfDeaf: false,
      selfVideo: false,
    });

    connection.on('ready', () => {
      console.log('Voice connection is ready.');
    });

    connection.on('error', error => {
      console.error('Error in voice connection:', error);
    });

    connection.on('disconnect', () => {
      console.log('Disconnected from voice channel');
    });

    console.log('Joined VC and staying there.');
  } catch (error) {
    console.error('Error joining voice channel:', error);
  }
});

// ---- ERROR HANDLERS (SO RENDER DOESN'T DIE SILENTLY) ----
client.on('error', err => {
  console.error('Client error:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled promise rejection:', err);
});

// ---- LOGIN ----
client.login(TOKEN);
