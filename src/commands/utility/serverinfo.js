const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Affiche les informations du serveur'),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: 'Propriétaire', value: owner.user.tag, inline: true },
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount ?? 0}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
