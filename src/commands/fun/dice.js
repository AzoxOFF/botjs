const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Fun',
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Lance un ou plusieurs dés')
    .addIntegerOption((o) => o.setName('faces').setDescription('Nombre de faces (par défaut 6)').setMinValue(2).setMaxValue(1000))
    .addIntegerOption((o) => o.setName('nombre').setDescription('Nombre de dés (par défaut 1)').setMinValue(1).setMaxValue(10)),
  async execute(interaction) {
    const faces = interaction.options.getInteger('faces') ?? 6;
    const count = interaction.options.getInteger('nombre') ?? 1;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * faces) + 1);

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('🎲 Lancer de dé')
      .setDescription(`${rolls.join(' • ')}\n\n**Total : ${rolls.reduce((a, b) => a + b, 0)}**`);
    await interaction.reply({ embeds: [embed] });
  },
};
