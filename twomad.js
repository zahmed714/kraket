const { Client, GatewayIntentBits } = require('discord.js-selfbot-v13');
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

  console.log('Available channels in the guild:');
  guild.channels.cache.forEach(channel => {
    console.log(`${channel.name} (ID: ${channel.id}, Type: ${channel.type})`);
  });

  const channel = await guild.channels.fetch(VOICE_CHANNEL_ID).catch(console.error);
  if (!channel) {
    console.error('Voice channel not found');
    return;
  }

  console.log(`Fetched channel: ${channel.name} (ID: ${channel.id}, Type: ${channel.type})`);

  // v13/selfbot: type is a string like "GUILD_VOICE"
  if (channel.type !== 'GUILD_VOICE') {
    console.error('Channel is not a voice channel');
    return;
  }

  try {
    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false
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

client.login(TOKEN);
