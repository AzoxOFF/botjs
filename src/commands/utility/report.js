const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const SUPPORT_CHANNEL_ID = '1521065920783716498';

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Signale un bug du bot à l\'équipe support')
    .addStringOption((o) => o.setName('description').setDescription('Décris le bug rencontré').setRequired(true))
    .addAttachmentOption((o) => o.setName('capture').setDescription('Capture d\'écran (optionnel)')),
  async execute(interaction) {
    const description = interaction.options.getString('description');
    const attachment = interaction.options.getAttachment('capture');

    const channel = await interaction.client.channels.fetch(SUPPORT_CHANNEL_ID).catch(() => null);
    if (!channel) {
      return interaction.reply({ content: '❌ Impossible de contacter le salon support pour le moment.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('🐛 Nouveau report')
      .addFields(
        { name: 'Description', value: description },
        { name: 'Auteur', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
        { name: 'Serveur', value: `${interaction.guild?.name ?? 'DM'} (${interaction.guild?.id ?? 'N/A'})`, inline: true },
      )
      .setTimestamp();

    if (attachment) embed.setImage(attachment.url);

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Ton report a été envoyé à l\'équipe support, merci !', ephemeral: true });
  },
};
