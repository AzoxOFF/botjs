const { ActivityType } = require('discord.js');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: `${client.guilds.cache.size} serveurs`, type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
