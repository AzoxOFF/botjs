const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'guildCreate',
  async execute(guild, client) {
    try {
      const commands = client.commands.map((c) => c.data.toJSON());
      const rest = new REST().setToken(process.env.DISCORD_TOKEN);
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), { body: commands });
      console.log(`✅ Commandes déployées instantanément sur ${guild.name} (${guild.id})`);
    } catch (error) {
      console.error(`Échec du déploiement instantané sur ${guild.name}:`, error);
    }
  },
};
