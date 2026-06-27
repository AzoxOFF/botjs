const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Affiche les informations d\'un membre')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre concerné')),
  async execute(interaction) {
    const user = interaction.options.getUser('membre') ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Compte créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: 'A rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: 'Rôles', value: member.roles.cache.filter((r) => r.id !== interaction.guild.id).map((r) => r.toString()).join(' ') || 'Aucun' },
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
