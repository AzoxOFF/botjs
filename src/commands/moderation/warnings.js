const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { warnings } = require('./warn.js');

module.exports = {
  category: 'Modération',
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Affiche les avertissements d\'un membre')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre concerné').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const key = `${interaction.guild.id}-${target.id}`;
    const list = warnings.get(key) ?? [];

    if (list.length === 0) {
      return interaction.reply({ content: `✅ ${target.tag} n'a aucun avertissement.`, ephemeral: true });
    }

    const description = list
      .map((w, i) => `**${i + 1}.** ${w.reason} — *par ${w.moderator}* (<t:${Math.floor(new Date(w.date).getTime() / 1000)}:R>)`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle(`⚠️ Avertissements de ${target.tag}`)
      .setDescription(description);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
