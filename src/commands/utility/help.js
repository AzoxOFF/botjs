const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder().setName('help').setDescription('Affiche la liste des commandes'),
  async execute(interaction) {
    const categories = {};
    for (const command of interaction.client.commands.values()) {
      const category = command.category ?? 'Autre';
      categories[category] = categories[category] ?? [];
      categories[category].push(`\`/${command.data.name}\` — ${command.data.description}`);
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📖 Liste des commandes')
      .setTimestamp();

    for (const [category, list] of Object.entries(categories)) {
      embed.addFields({ name: category, value: list.join('\n') });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
