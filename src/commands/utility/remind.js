const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Te rappelle quelque chose après un délai')
    .addIntegerOption((o) => o.setName('minutes').setDescription('Délai en minutes').setRequired(true).setMinValue(1).setMaxValue(1440))
    .addStringOption((o) => o.setName('message').setDescription('Le message du rappel').setRequired(true)),
  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message');

    await interaction.reply({ content: `⏰ Rappel programmé dans ${minutes} minute(s) : "${message}"`, ephemeral: true });

    setTimeout(() => {
      const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('⏰ Rappel').setDescription(message);
      interaction.user.send({ embeds: [embed] }).catch(() => {
        interaction.followUp({ content: `⏰ <@${interaction.user.id}> Rappel : ${message}` }).catch(() => {});
      });
    }, minutes * 60 * 1000);
  },
};
