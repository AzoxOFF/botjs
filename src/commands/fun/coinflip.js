const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Fun',
  data: new SlashCommandBuilder().setName('coinflip').setDescription('Lance une pièce'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Face' : 'Pile';
    const embed = new EmbedBuilder().setColor(0xf1c40f).setTitle('🪙 Pile ou face').setDescription(`Résultat : **${result}**`);
    await interaction.reply({ embeds: [embed] });
  },
};
