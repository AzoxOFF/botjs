const { Collection, MessageFlags } = require('discord.js');
const ticketHandler = require('../handlers/ticketHandler.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isStringSelectMenu() || interaction.isButton()) {
      return ticketHandler.handleInteraction(interaction).catch((error) => {
        console.error('Erreur dans le gestionnaire de tickets:', error);
      });
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expiresAt = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiresAt) {
        const remaining = ((expiresAt - now) / 1000).toFixed(1);
        return interaction.reply({
          content: `⏳ Patiente encore ${remaining}s avant de réutiliser \`/${command.data.name}\`.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Erreur dans la commande ${interaction.commandName}:`, error);
      const payload = { content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.', flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    }
  },
};
