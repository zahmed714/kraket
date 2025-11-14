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

  // Fetch the channel again after the bot is ready
  const channel = await guild.channels.fetch(VOICE_CHANNEL_ID).catch(console.error);
  if (!channel || (channel.type !== 2 && channel.type !== ChannelType.GuildVoice)) { // Check for both old and new channel types
    console.error('Voice channel not found or not voice');
    return;
  }

  try {
    await joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false
    });
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
