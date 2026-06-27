const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const warnings = new Map();

module.exports = {
  category: 'Modération',
  warnings,
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertit un membre')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre à avertir').setRequired(true))
    .addStringOption((o) => o.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');
    const key = `${interaction.guild.id}-${target.id}`;

    const list = warnings.get(key) ?? [];
    list.push({ reason, moderator: interaction.user.tag, date: new Date().toISOString() });
    warnings.set(key, list);

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('⚠️ Avertissement')
      .addFields(
        { name: 'Membre', value: `${target.tag}`, inline: true },
        { name: 'Total avertissements', value: `${list.length}`, inline: true },
        { name: 'Raison', value: reason },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });

    target.send(`⚠️ Tu as reçu un avertissement sur **${interaction.guild.name}** : ${reason}`).catch(() => {});
  },
};
