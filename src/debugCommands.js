require('dotenv').config();
const { REST, Routes } = require('discord.js');

const guildId = process.argv[2];
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
    console.log(`\n--- Commandes GLOBALES (${globalCommands.length}) ---`);
    for (const cmd of globalCommands) {
      console.log(`${cmd.name} -> id: ${cmd.id}`);
    }
    for (const cmd of globalCommands) {
      await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, cmd.id));
    }
    console.log('✅ Toutes les commandes globales supprimées une par une.');

    if (guildId) {
      const guildCommands = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId));
      console.log(`\n--- Commandes GUILD ${guildId} (${guildCommands.length}) ---`);
      for (const cmd of guildCommands) {
        console.log(`${cmd.name} -> id: ${cmd.id}`);
      }
      for (const cmd of guildCommands) {
        await rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, guildId, cmd.id));
      }
      console.log('✅ Toutes les commandes guild supprimées une par une.');
    }
  } catch (error) {
    console.error(error);
  }
})();
