const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder().setName('ping').setDescription('Affiche la latence du bot'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pong...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🏓 Pong !')
      .addFields(
        { name: 'Latence du message', value: `${latency}ms`, inline: true },
        { name: 'Latence API', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
      );
    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
