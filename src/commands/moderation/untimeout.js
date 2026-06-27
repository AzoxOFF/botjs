const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Modération',
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Retire le silence d\'un membre')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre concerné').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    if (!target) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });

    await target.timeout(null);
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('🔊 Silence retiré')
      .setDescription(`${target.user.tag} peut de nouveau parler.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
