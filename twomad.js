const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

// =====================
// CONFIG
// =====================
const TOKEN = process.env.DISCORD_TOKEN;   // <-- now using environment variable
const GUILD_ID = '1210305827148144701';
const VOICE_CHANNEL_ID = '1417545211109834885';

const client = new Client({
  checkUpdate: false,
  readyStatus: false
});

// =====================
// Join VC on ready
// =====================
client.on('ready', async () => {
  console.log(`[READY] Logged in as ${client.user.username}#${client.user.discriminator}`);

  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error('❌ Guild not found — check GUILD_ID');
      return;
    }

    const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!channel || channel.type !== 2) { // 2 = GUILD_VOICE
      console.error('❌ Voice channel not found — check VOICE_CHANNEL_ID');
      return;
    }

    joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false
    });

    console.log('🎧 Joined voice channel and staying there.');
  } catch (err) {
    console.error('⚠️ Failed to join voice channel:', err);
  }
});

client.login(TOKEN);
