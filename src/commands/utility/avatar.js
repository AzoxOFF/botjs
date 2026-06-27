const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Affiche l\'avatar d\'un membre')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre concerné')),
  async execute(interaction) {
    const user = interaction.options.getUser('membre') ?? interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 1024 }));
    await interaction.reply({ embeds: [embed] });
  },
};
